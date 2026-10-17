import cv2
import mediapipe as mp
import pygame
import random
import time
import math


# ============================================================
# CONFIGURACOES GERAIS
# ============================================================

LARGURA_JOGO = 820
LARGURA_CAMERA = 320
LARGURA_TOTAL = LARGURA_JOGO + LARGURA_CAMERA
ALTURA = 680

FPS = 60
CAMERA_INDEX = 0

CHAO_Y = 580

# Jogador
JOGADOR_X = 140
JOGADOR_L = 70
JOGADOR_A = 120

# Soco
ALCANCE_SOCO_X = 150
ALCANCE_SOCO_Y = 90
TEMPO_ANIMACAO_SOCO = 0.15
COOLDOWN_SOCO = 0.35

# Deteccao do soco pela camera
# Se o punho "crescer" rapido na imagem,
# significa que a mao foi em direcao a camera.
SOCO_MULTIPLICADOR_AREA = 1.33

# Vida
VIDAS_INICIAIS = 5


# ============================================================
# PYGAME
# ============================================================

pygame.init()

tela = pygame.display.set_mode((LARGURA_TOTAL, ALTURA))
pygame.display.set_caption("Lutinha com soco na camera")

clock = pygame.time.Clock()

fonte_grande = pygame.font.SysFont("Arial", 42, bold=True)
fonte_media = pygame.font.SysFont("Arial", 26, bold=True)
fonte_pequena = pygame.font.SysFont("Arial", 20)


# ============================================================
# CAMERA / MEDIAPIPE
# ============================================================

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

camera = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

if not camera.isOpened():
    print("ERRO: nao foi possivel abrir a camera.")
    pygame.quit()
    exit()


# ============================================================
# FUNCOES DA MAO
# ============================================================

def distancia(a, b):
    return math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)


def area_mao(hand_landmarks):
    pontos = hand_landmarks.landmark
    xs = [p.x for p in pontos]
    ys = [p.y for p in pontos]

    largura = max(xs) - min(xs)
    altura = max(ys) - min(ys)

    return max(largura * altura, 0.000001)


def punho_fechado(hand_landmarks):
    """
    Verifica se a maioria dos dedos esta curvada.
    """

    lm = hand_landmarks.landmark

    dedos_curvados = 0

    dedos = [
        (8, 6),    # indicador
        (12, 10),  # medio
        (16, 14),  # anelar
        (20, 18)   # minimo
    ]

    for tip, pip in dedos:
        if lm[tip].y > lm[pip].y - 0.01:
            dedos_curvados += 1

    return dedos_curvados >= 3


def desenhar_pontos_mao(frame, hand_landmarks):
    mp_drawing.draw_landmarks(
        frame,
        hand_landmarks,
        mp_hands.HAND_CONNECTIONS,
        mp_drawing_styles.get_default_hand_landmarks_style(),
        mp_drawing_styles.get_default_hand_connections_style()
    )


# ============================================================
# CLASSE DOS MONSTROS
# ============================================================

class Monstro:
    def __init__(self):
        self.l = random.randint(55, 85)
        self.a = random.randint(80, 120)
        self.x = LARGURA_JOGO + random.randint(0, 80)
        self.y = CHAO_Y - self.a
        self.vel = random.uniform(2.3, 4.2)
        self.cor = random.choice([
            (180, 60, 200),
            (60, 200, 80),
            (220, 70, 70),
            (70, 150, 220)
        ])
        self.flash_ate = 0

    def rect(self):
        return pygame.Rect(int(self.x), int(self.y), self.l, self.a)

    def atualizar(self):
        self.x -= self.vel

    def desenhar(self, tela):
        cor = self.cor
        if time.time() < self.flash_ate:
            cor = (255, 255, 255)

        corpo = self.rect()
        pygame.draw.rect(tela, cor, corpo, border_radius=12)

        # olhos
        pygame.draw.circle(tela, (255, 255, 255), (corpo.x + 18, corpo.y + 22), 7)
        pygame.draw.circle(tela, (255, 255, 255), (corpo.x + corpo.w - 18, corpo.y + 22), 7)
        pygame.draw.circle(tela, (0, 0, 0), (corpo.x + 18, corpo.y + 22), 3)
        pygame.draw.circle(tela, (0, 0, 0), (corpo.x + corpo.w - 18, corpo.y + 22), 3)

        # boca
        pygame.draw.line(
            tela,
            (0, 0, 0),
            (corpo.x + 18, corpo.y + 52),
            (corpo.x + corpo.w - 18, corpo.y + 52),
            3
        )

        # perninhas
        pygame.draw.line(tela, (0, 0, 0), (corpo.x + 18, corpo.bottom), (corpo.x + 10, corpo.bottom + 14), 3)
        pygame.draw.line(tela, (0, 0, 0), (corpo.right - 18, corpo.bottom), (corpo.right - 10, corpo.bottom + 14), 3)


# ============================================================
# ESTADO DO JOGO
# ============================================================

def reiniciar_jogo():
    return {
        "monstros": [],
        "score": 0,
        "vidas": VIDAS_INICIAIS,
        "ultimo_spawn": time.time(),
        "ultimo_dano": 0,
        "ultimo_soco_jogo": 0,
        "soco_anim_ate": 0,
        "estado": "JOGANDO"
    }


jogo = reiniciar_jogo()


# ============================================================
# VARIAVEIS DA CAMERA / SOCO
# ============================================================

mao_detectada = False
punho = False
punch_event = False

area_anterior = None
area_suavizada = None
ultimo_soco_camera = 0

camera_surface = None
status_camera = "SEM MAO"
status_cor = (255, 120, 120)
ultima_area = 0.0
ultima_razao = 1.0


# ============================================================
# FUNCOES DE COMBATE
# ============================================================

def rect_soco():
    return pygame.Rect(
        JOGADOR_X + JOGADOR_L - 5,
        CHAO_Y - 95,
        ALCANCE_SOCO_X,
        ALCANCE_SOCO_Y
    )


def aplicar_soco():
    """
    Aplica dano em monstros dentro do alcance.
    """
    alcance = rect_soco()
    acertos = 0

    monstros_restantes = []

    for monstro in jogo["monstros"]:
        if monstro.rect().colliderect(alcance):
            acertos += 1
            jogo["score"] += 1
            # monstro eliminado
        else:
            monstros_restantes.append(monstro)

    jogo["monstros"] = monstros_restantes
    return acertos


# ============================================================
# LOOP PRINCIPAL
# ============================================================

executando = True

while executando:
    clock.tick(FPS)

    agora = time.time()

    # --------------------------------------------------------
    # EVENTOS
    # --------------------------------------------------------
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            executando = False

        if evento.type == pygame.KEYDOWN:
            if evento.key == pygame.K_ESCAPE:
                executando = False

            if evento.key == pygame.K_r:
                jogo = reiniciar_jogo()

            # Tecla reserva
            if evento.key == pygame.K_SPACE:
                if jogo["estado"] == "GAME_OVER":
                    jogo = reiniciar_jogo()
                else:
                    if agora - jogo["ultimo_soco_jogo"] > COOLDOWN_SOCO:
                        jogo["ultimo_soco_jogo"] = agora
                        jogo["soco_anim_ate"] = agora + TEMPO_ANIMACAO_SOCO
                        aplicar_soco()

    # --------------------------------------------------------
    # LEITURA DA CAMERA
    # --------------------------------------------------------
    sucesso, frame = camera.read()

    punch_event = False
    mao_detectada = False
    punho = False
    razao_area = 1.0

    if sucesso:
        frame = cv2.flip(frame, 1)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        resultado = hands.process(frame_rgb)

        if resultado.multi_hand_landmarks:
            mao_detectada = True

            hand_landmarks = resultado.multi_hand_landmarks[0]
            desenhar_pontos_mao(frame, hand_landmarks)

            punho = punho_fechado(hand_landmarks)
            area_atual = area_mao(hand_landmarks)
            ultima_area = area_atual

            if area_suavizada is None:
                area_suavizada = area_atual
            else:
                area_suavizada = area_suavizada * 0.75 + area_atual * 0.25

            if area_anterior is None:
                area_anterior = area_suavizada

            if area_anterior > 0:
                razao_area = area_suavizada / area_anterior

            ultima_razao = razao_area

            # SOCO: punho fechado + mao "aumenta" rapido na camera
            if punho:
                if (
                    razao_area > SOCO_MULTIPLICADOR_AREA
                    and agora - ultimo_soco_camera > COOLDOWN_SOCO
                ):
                    punch_event = True
                    ultimo_soco_camera = agora

            area_anterior = area_suavizada

            if punch_event:
                status_camera = "SOCO!"
                status_cor = (0, 255, 120)
            elif punho:
                status_camera = "PUNHO FECHADO"
                status_cor = (255, 220, 0)
            else:
                status_camera = "MAO ABERTA"
                status_cor = (255, 255, 255)

        else:
            status_camera = "SEM MAO"
            status_cor = (255, 120, 120)
            area_anterior = None
            area_suavizada = None
            ultima_razao = 1.0

        # converte camera para mostrar no pygame
        cam_show = cv2.resize(frame, (LARGURA_CAMERA, 240))
        cam_show = cv2.cvtColor(cam_show, cv2.COLOR_BGR2RGB)

        camera_surface = pygame.image.frombuffer(
            cam_show.tobytes(),
            (LARGURA_CAMERA, 240),
            "RGB"
        )

    # --------------------------------------------------------
    # JOGO - SOCO VIA CAMERA
    # --------------------------------------------------------
    if punch_event:
        if jogo["estado"] == "GAME_OVER":
            jogo = reiniciar_jogo()
        else:
            jogo["ultimo_soco_jogo"] = agora
            jogo["soco_anim_ate"] = agora + TEMPO_ANIMACAO_SOCO
            aplicar_soco()

    # --------------------------------------------------------
    # ATUALIZAR JOGO
    # --------------------------------------------------------
    if jogo["estado"] == "JOGANDO":
        # spawn de monstros
        intervalo_spawn = max(0.65, 1.35 - jogo["score"] * 0.02)

        if agora - jogo["ultimo_spawn"] >= intervalo_spawn:
            jogo["monstros"].append(Monstro())
            jogo["ultimo_spawn"] = agora

        # atualizar monstros
        monstros_restantes = []

        for monstro in jogo["monstros"]:
            monstro.atualizar()

            # monstro atingiu jogador
            if monstro.rect().colliderect(
                pygame.Rect(JOGADOR_X, CHAO_Y - JOGADOR_A, JOGADOR_L, JOGADOR_A)
            ):
                if agora - jogo["ultimo_dano"] > 0.7:
                    jogo["vidas"] -= 1
                    jogo["ultimo_dano"] = agora

                # remove o monstro ao bater no jogador
            elif monstro.x > -120:
                monstros_restantes.append(monstro)

        jogo["monstros"] = monstros_restantes

        if jogo["vidas"] <= 0:
            jogo["estado"] = "GAME_OVER"

    # --------------------------------------------------------
    # DESENHO DO FUNDO
    # --------------------------------------------------------
    tela.fill((40, 40, 55))

    # ceu
    pygame.draw.rect(tela, (70, 90, 130), (0, 0, LARGURA_JOGO, ALTURA))

    # predios fundo
    for i in range(0, LARGURA_JOGO, 120):
        altura_predio = 120 + (i % 3) * 40
        pygame.draw.rect(
            tela,
            (55, 65, 85),
            (i, CHAO_Y - altura_predio, 90, altura_predio)
        )

    # chao
    pygame.draw.rect(tela, (80, 60, 40), (0, CHAO_Y, LARGURA_JOGO, ALTURA - CHAO_Y))
    pygame.draw.rect(tela, (110, 110, 110), (0, CHAO_Y - 18, LARGURA_JOGO, 18))

    # --------------------------------------------------------
    # JOGADOR
    # --------------------------------------------------------
    jogador_rect = pygame.Rect(JOGADOR_X, CHAO_Y - JOGADOR_A, JOGADOR_L, JOGADOR_A)

    cor_jogador = (255, 210, 60)
    if jogo["estado"] == "GAME_OVER":
        cor_jogador = (160, 160, 160)

    # corpo
    pygame.draw.rect(tela, cor_jogador, jogador_rect, border_radius=12)

    # cabeca
    pygame.draw.circle(tela, (255, 220, 180), (JOGADOR_X + 35, CHAO_Y - JOGADOR_A - 20), 24)

    # olhos
    pygame.draw.circle(tela, (0, 0, 0), (JOGADOR_X + 27, CHAO_Y - JOGADOR_A - 24), 3)
    pygame.draw.circle(tela, (0, 0, 0), (JOGADOR_X + 43, CHAO_Y - JOGADOR_A - 24), 3)

    # pernas
    pygame.draw.line(tela, (0, 0, 0), (JOGADOR_X + 20, CHAO_Y), (JOGADOR_X + 10, CHAO_Y + 22), 4)
    pygame.draw.line(tela, (0, 0, 0), (JOGADOR_X + 50, CHAO_Y), (JOGADOR_X + 60, CHAO_Y + 22), 4)

    # bracos
    socando = agora < jogo["soco_anim_ate"]

    if socando:
        pygame.draw.line(
            tela,
            (0, 0, 0),
            (JOGADOR_X + 56, CHAO_Y - 72),
            (JOGADOR_X + 120, CHAO_Y - 72),
            7
        )
        pygame.draw.circle(tela, (255, 220, 180), (JOGADOR_X + 128, CHAO_Y - 72), 10)

        # area do soco visivel
        alcance = rect_soco()
        pygame.draw.rect(tela, (255, 80, 80), alcance, 3, border_radius=8)
    else:
        pygame.draw.line(
            tela,
            (0, 0, 0),
            (JOGADOR_X + 56, CHAO_Y - 72),
            (JOGADOR_X + 82, CHAO_Y - 52),
            6
        )
        pygame.draw.circle(tela, (255, 220, 180), (JOGADOR_X + 88, CHAO_Y - 47), 8)

    # outro braco
    pygame.draw.line(
        tela,
        (0, 0, 0),
        (JOGADOR_X + 14, CHAO_Y - 72),
        (JOGADOR_X - 8, CHAO_Y - 50),
        6
    )

    # --------------------------------------------------------
    # MONSTROS
    # --------------------------------------------------------
    for monstro in jogo["monstros"]:
        monstro.desenhar(tela)

    # --------------------------------------------------------
    # HUD
    # --------------------------------------------------------
    texto_score = fonte_grande.render(f"Pontos: {jogo['score']}", True, (255, 255, 255))
    tela.blit(texto_score, (25, 20))

    texto_vidas = fonte_media.render(f"Vidas: {jogo['vidas']}", True, (255, 220, 120))
    tela.blit(texto_vidas, (28, 74))

    instru1 = fonte_pequena.render("SOCO = punho fechado + empurrar a mao para a camera", True, (230, 230, 230))
    instru2 = fonte_pequena.render("ESPACO = soco reserva | R = reiniciar | ESC = sair", True, (230, 230, 230))
    tela.blit(instru1, (25, 116))
    tela.blit(instru2, (25, 141))

    # --------------------------------------------------------
    # PAINEL DA CAMERA
    # --------------------------------------------------------
    pygame.draw.rect(tela, (22, 22, 28), (LARGURA_JOGO, 0, LARGURA_CAMERA, ALTURA))

    titulo = fonte_media.render("CAMERA / CONTROLE", True, (255, 255, 255))
    tela.blit(titulo, (LARGURA_JOGO + 38, 18))

    if camera_surface:
        tela.blit(camera_surface, (LARGURA_JOGO, 60))

    txt1 = fonte_pequena.render(f"Status: {status_camera}", True, status_cor)
    txt2 = fonte_pequena.render(f"Mao detectada: {'SIM' if mao_detectada else 'NAO'}", True, (220, 220, 220))
    txt3 = fonte_pequena.render(f"Punho fechado: {'SIM' if punho else 'NAO'}", True, (220, 220, 220))
    txt4 = fonte_pequena.render(f"Area da mao: {ultima_area:.4f}", True, (220, 220, 220))
    txt5 = fonte_pequena.render(f"Razao area: {ultima_razao:.2f}", True, (220, 220, 220))
    txt6 = fonte_pequena.render(f"Limite soco: {SOCO_MULTIPLICADOR_AREA:.2f}", True, (220, 220, 220))

    tela.blit(txt1, (LARGURA_JOGO + 20, 320))
    tela.blit(txt2, (LARGURA_JOGO + 20, 350))
    tela.blit(txt3, (LARGURA_JOGO + 20, 380))
    tela.blit(txt4, (LARGURA_JOGO + 20, 410))
    tela.blit(txt5, (LARGURA_JOGO + 20, 440))
    tela.blit(txt6, (LARGURA_JOGO + 20, 470))

    dicas = [
        "Como jogar:",
        "- Mostre 1 mao",
        "- Feche o punho",
        "- Empurre o punho",
        "  em direcao a camera",
        "- Cada soco elimina",
        "  monstros no alcance"
    ]

    y = 520
    for linha in dicas:
        t = fonte_pequena.render(linha, True, (200, 200, 200))
        tela.blit(t, (LARGURA_JOGO + 20, y))
        y += 24

    # --------------------------------------------------------
    # GAME OVER
    # --------------------------------------------------------
    if jogo["estado"] == "GAME_OVER":
        overlay = pygame.Surface((LARGURA_JOGO, ALTURA))
        overlay.set_alpha(160)
        overlay.fill((0, 0, 0))
        tela.blit(overlay, (0, 0))

        g1 = fonte_grande.render("GAME OVER", True, (255, 90, 90))
        g2 = fonte_media.render(f"Pontuacao final: {jogo['score']}", True, (255, 255, 255))
        g3 = fonte_media.render("Faca um soco ou aperte R para reiniciar", True, (255, 255, 255))

        tela.blit(g1, (LARGURA_JOGO // 2 - g1.get_width() // 2, 250))
        tela.blit(g2, (LARGURA_JOGO // 2 - g2.get_width() // 2, 315))
        tela.blit(g3, (LARGURA_JOGO // 2 - g3.get_width() // 2, 375))

    pygame.display.flip()


# ============================================================
# FINALIZACAO
# ============================================================

camera.release()
hands.close()
pygame.quit()

print("Jogo encerrado.")