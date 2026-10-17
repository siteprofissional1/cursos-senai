import cv2
import mediapipe as mp
import pygame
import random
import time
import math


# ============================================================
# CONFIGURACOES
# ============================================================

LARGURA_JOGO = 820
LARGURA_CAMERA = 320
LARGURA_TOTAL = LARGURA_JOGO + LARGURA_CAMERA
ALTURA = 680

FPS = 60
CAMERA_INDEX = 0

# Estrada
ROAD_LEFT = 210
ROAD_WIDTH = 400
ROAD_RIGHT = ROAD_LEFT + ROAD_WIDTH
LANES = 3
LANE_WIDTH = ROAD_WIDTH / LANES

# Jogador
CARRO_W = 52
CARRO_H = 96
CARRO_Y = ALTURA - 130

# Direcao
VELOCIDADE_DIRECAO = 8.0
INVERTER_DIRECAO = False

# Spawn e dificuldade
VIDAS_INICIAIS = 3
TEMPO_INVENCIVEL = 1.0


# ============================================================
# PYGAME
# ============================================================

pygame.init()

tela = pygame.display.set_mode((LARGURA_TOTAL, ALTURA))
pygame.display.set_caption("Corrida na estrada controlada pela mao")

clock = pygame.time.Clock()

fonte_grande = pygame.font.SysFont("Arial", 40, bold=True)
fonte_media = pygame.font.SysFont("Arial", 24, bold=True)
fonte_pequena = pygame.font.SysFont("Arial", 18)


# ============================================================
# MEDIAPIPE
# ============================================================

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)


# ============================================================
# CAMERA
# ============================================================

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

def centro_mao(hand_landmarks):
    xs = [p.x for p in hand_landmarks.landmark]
    ys = [p.y for p in hand_landmarks.landmark]
    return (sum(xs) / len(xs), sum(ys) / len(ys))


def angulo_entre_pontos(p1, p2):
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    return math.degrees(math.atan2(dy, dx))


def normalizar_angulo(a):
    while a > 180:
        a -= 360
    while a < -180:
        a += 360
    return a


def clamp(valor, minimo, maximo):
    return max(minimo, min(maximo, valor))


# ============================================================
# INIMIGOS
# ============================================================

class CarroInimigo:
    def __init__(self, x, velocidade, cor):
        self.x = x
        self.y = -120
        self.w = 50
        self.h = 92
        self.vel = velocidade
        self.cor = cor

    def rect(self):
        return pygame.Rect(int(self.x), int(self.y), self.w, self.h)

    def atualizar(self):
        self.y += self.vel

    def desenhar(self, tela):
        r = self.rect()

        # corpo
        pygame.draw.rect(tela, self.cor, r, border_radius=10)

        # vidro
        pygame.draw.rect(
            tela,
            (180, 220, 255),
            (r.x + 10, r.y + 12, r.w - 20, 24),
            border_radius=6
        )

        # detalhe
        pygame.draw.rect(
            tela,
            (40, 40, 40),
            (r.x + 8, r.y + 46, r.w - 16, 18),
            border_radius=6
        )

        # rodas
        pygame.draw.rect(tela, (20, 20, 20), (r.x - 4, r.y + 15, 8, 18), border_radius=3)
        pygame.draw.rect(tela, (20, 20, 20), (r.right - 4, r.y + 15, 8, 18), border_radius=3)
        pygame.draw.rect(tela, (20, 20, 20), (r.x - 4, r.bottom - 33, 8, 18), border_radius=3)
        pygame.draw.rect(tela, (20, 20, 20), (r.right - 4, r.bottom - 33, 8, 18), border_radius=3)


# ============================================================
# ESTADO DO JOGO
# ============================================================

def reiniciar():
    return {
        "carro_x": ROAD_LEFT + ROAD_WIDTH / 2 - CARRO_W / 2,
        "steer_suave": 0.0,
        "inimigos": [],
        "score": 0,
        "vidas": VIDAS_INICIAIS,
        "ultimo_spawn": time.time(),
        "invencivel_ate": 0,
        "game_over": False,
        "dash_offset": 0
    }


jogo = reiniciar()

neutral_angle = 0.0
ultimo_angulo = 0.0
status_controle = "MOSTRE AS 2 MAOS"
camera_surface = None
duas_maos = False


# ============================================================
# FUNCOES DE DESENHO
# ============================================================

def desenhar_estrada(tela, dash_offset, score):
    # grama
    tela.fill((60, 140, 70))

    # acostamento
    pygame.draw.rect(tela, (130, 130, 130), (ROAD_LEFT - 12, 0, 12, ALTURA))
    pygame.draw.rect(tela, (130, 130, 130), (ROAD_RIGHT, 0, 12, ALTURA))

    # estrada
    pygame.draw.rect(tela, (55, 55, 60), (ROAD_LEFT, 0, ROAD_WIDTH, ALTURA))

    # faixas laterais
    pygame.draw.line(tela, (255, 255, 255), (ROAD_LEFT, 0), (ROAD_LEFT, ALTURA), 4)
    pygame.draw.line(tela, (255, 255, 255), (ROAD_RIGHT, 0), (ROAD_RIGHT, ALTURA), 4)

    # divisorias das pistas
    for i in range(1, LANES):
        x = ROAD_LEFT + i * LANE_WIDTH
        y = -60 + dash_offset
        while y < ALTURA:
            pygame.draw.rect(
                tela,
                (240, 240, 240),
                (x - 4, y, 8, 38),
                border_radius=3
            )
            y += 70

    # placas decorativas
    for y in range(40, ALTURA, 140):
        pygame.draw.rect(tela, (180, 180, 180), (70, y, 10, 38))
        pygame.draw.rect(tela, (180, 180, 180), (720, y + 30, 10, 38))
        pygame.draw.rect(tela, (240, 210, 80), (50, y - 5, 45, 28), border_radius=5)
        pygame.draw.rect(tela, (240, 210, 80), (700, y + 25, 45, 28), border_radius=5)


def desenhar_carro_jogador(tela, x, y, piscando=False):
    r = pygame.Rect(int(x), int(y), CARRO_W, CARRO_H)

    cor = (60, 170, 255)
    if piscando:
        if int(time.time() * 10) % 2 == 0:
            cor = (255, 255, 255)

    # corpo
    pygame.draw.rect(tela, cor, r, border_radius=12)

    # vidro
    pygame.draw.rect(
        tela,
        (180, 220, 255),
        (r.x + 10, r.y + 10, r.w - 20, 24),
        border_radius=6
    )

    # capô
    pygame.draw.rect(
        tela,
        (40, 40, 45),
        (r.x + 9, r.y + 45, r.w - 18, 24),
        border_radius=8
    )

    # rodas
    pygame.draw.rect(tela, (15, 15, 15), (r.x - 4, r.y + 12, 8, 18), border_radius=3)
    pygame.draw.rect(tela, (15, 15, 15), (r.right - 4, r.y + 12, 8, 18), border_radius=3)
    pygame.draw.rect(tela, (15, 15, 15), (r.x - 4, r.bottom - 30, 8, 18), border_radius=3)
    pygame.draw.rect(tela, (15, 15, 15), (r.right - 4, r.bottom - 30, 8, 18), border_radius=3)


def centro_pista(lane_index):
    return ROAD_LEFT + lane_index * LANE_WIDTH + LANE_WIDTH / 2


# ============================================================
# LOOP PRINCIPAL
# ============================================================

executando = True

while executando:
    dt = clock.tick(FPS) / 1000.0
    agora = time.time()

    velocidade_jogo = min(8.5, 5.0 + jogo["score"] * 0.03)

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
                jogo = reiniciar()

            if evento.key == pygame.K_c:
                neutral_angle = ultimo_angulo

            if evento.key == pygame.K_i:
                INVERTER_DIRECAO = not INVERTER_DIRECAO

    # --------------------------------------------------------
    # CAMERA / CONTROLE
    # --------------------------------------------------------
    steer_bruto = 0.0
    duas_maos = False

    sucesso, frame = camera.read()

    if sucesso:
        frame = cv2.flip(frame, 1)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        resultado = hands.process(frame_rgb)

        if resultado.multi_hand_landmarks and len(resultado.multi_hand_landmarks) >= 2:
            duas_maos = True

            # desenha landmarks
            for mao in resultado.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame,
                    mao,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style()
                )

            # centros das 2 maos
            centros = [centro_mao(mao) for mao in resultado.multi_hand_landmarks[:2]]
            centros.sort(key=lambda p: p[0])  # esquerda -> direita

            esquerda = centros[0]
            direita = centros[1]

            h, w, _ = frame.shape

            p1 = (int(esquerda[0] * w), int(esquerda[1] * h))
            p2 = (int(direita[0] * w), int(direita[1] * h))

            cv2.circle(frame, p1, 10, (0, 255, 255), -1)
            cv2.circle(frame, p2, 10, (0, 255, 255), -1)
            cv2.line(frame, p1, p2, (0, 255, 255), 4)

            ang = angulo_entre_pontos(esquerda, direita)
            ultimo_angulo = ang

            relativo = normalizar_angulo(ang - neutral_angle)

            if INVERTER_DIRECAO:
                relativo *= -1

            relativo = clamp(relativo, -30, 30)
            steer_bruto = relativo / 30.0

            status_controle = "VOLANTE DETECTADO"

            cv2.putText(
                frame,
                f"Angulo: {ang:.1f}",
                (20, 35),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255, 255, 255),
                2
            )

            cv2.putText(
                frame,
                f"Relativo: {relativo:.1f}",
                (20, 70),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255, 255, 255),
                2
            )

        else:
            status_controle = "MOSTRE AS 2 MAOS"

        # mostrar camera no pygame
        cam_show = cv2.resize(frame, (LARGURA_CAMERA, 240))
        cam_show = cv2.cvtColor(cam_show, cv2.COLOR_BGR2RGB)

        camera_surface = pygame.image.frombuffer(
            cam_show.tobytes(),
            (LARGURA_CAMERA, 240),
            "RGB"
        )

    # suavizacao
    jogo["steer_suave"] = jogo["steer_suave"] * 0.78 + steer_bruto * 0.22

    # teclado reserva
    teclas = pygame.key.get_pressed()
    if teclas[pygame.K_LEFT]:
        jogo["steer_suave"] -= 0.08
    if teclas[pygame.K_RIGHT]:
        jogo["steer_suave"] += 0.08

    jogo["steer_suave"] = clamp(jogo["steer_suave"], -1.0, 1.0)

    # --------------------------------------------------------
    # ATUALIZAR JOGO
    # --------------------------------------------------------
    if not jogo["game_over"]:
        # mover carro
        jogo["carro_x"] += jogo["steer_suave"] * VELOCIDADE_DIRECAO

        min_x = ROAD_LEFT + 8
        max_x = ROAD_RIGHT - CARRO_W - 8
        jogo["carro_x"] = clamp(jogo["carro_x"], min_x, max_x)

        # spawn inimigos
        intervalo_spawn = max(0.45, 1.10 - jogo["score"] * 0.01)

        if agora - jogo["ultimo_spawn"] >= intervalo_spawn:
            lane = random.randint(0, LANES - 1)
            centro = centro_pista(lane)
            x_spawn = centro - 25 + random.randint(-10, 10)

            cor = random.choice([
                (220, 70, 70),
                (240, 170, 50),
                (180, 70, 220),
                (80, 200, 120),
                (240, 240, 80)
            ])

            vel = velocidade_jogo + random.uniform(1.0, 2.8)

            jogo["inimigos"].append(CarroInimigo(x_spawn, vel, cor))
            jogo["ultimo_spawn"] = agora

        # atualizar inimigos
        jogador_rect = pygame.Rect(int(jogo["carro_x"]), CARRO_Y, CARRO_W, CARRO_H)
        novos = []

        for inimigo in jogo["inimigos"]:
            inimigo.atualizar()

            if inimigo.rect().colliderect(jogador_rect):
                if agora > jogo["invencivel_ate"]:
                    jogo["vidas"] -= 1
                    jogo["invencivel_ate"] = agora + TEMPO_INVENCIVEL
                # remove inimigo ao bater
                continue

            if inimigo.y > ALTURA + 20:
                jogo["score"] += 1
                continue

            novos.append(inimigo)

        jogo["inimigos"] = novos

        if jogo["vidas"] <= 0:
            jogo["game_over"] = True

        jogo["dash_offset"] = (jogo["dash_offset"] + velocidade_jogo * 2.2) % 70

    # --------------------------------------------------------
    # DESENHO
    # --------------------------------------------------------
    desenhar_estrada(tela, jogo["dash_offset"], jogo["score"])

    # inimigos
    for inimigo in jogo["inimigos"]:
        inimigo.desenhar(tela)

    # jogador
    piscando = agora < jogo["invencivel_ate"]
    desenhar_carro_jogador(tela, jogo["carro_x"], CARRO_Y, piscando=piscando)

    # hud
    txt_score = fonte_grande.render(f"Pontos: {jogo['score']}", True, (255, 255, 255))
    tela.blit(txt_score, (20, 18))

    txt_vidas = fonte_media.render(f"Vidas: {jogo['vidas']}", True, (255, 235, 120))
    tela.blit(txt_vidas, (24, 66))

    txt_vel = fonte_pequena.render(f"Velocidade: {velocidade_jogo:.1f}", True, (255, 255, 255))
    tela.blit(txt_vel, (24, 102))

    txt_instr = fonte_pequena.render("C = calibrar volante | I = inverter direcao | R = reiniciar | ESC = sair", True, (255, 255, 255))
    tela.blit(txt_instr, (20, ALTURA - 32))

    # painel camera
    pygame.draw.rect(tela, (22, 22, 28), (LARGURA_JOGO, 0, LARGURA_CAMERA, ALTURA))

    titulo = fonte_media.render("VOLANTE PELA CAMERA", True, (255, 255, 255))
    tela.blit(titulo, (LARGURA_JOGO + 24, 18))

    if camera_surface:
        tela.blit(camera_surface, (LARGURA_JOGO, 60))

    cor_status = (255, 255, 255)
    if duas_maos:
        cor_status = (0, 255, 120)
    else:
        cor_status = (255, 120, 120)

    linhas = [
        f"Status: {status_controle}",
        f"2 maos detectadas: {'SIM' if duas_maos else 'NAO'}",
        f"Angulo atual: {ultimo_angulo:.1f}",
        f"Angulo neutro: {neutral_angle:.1f}",
        f"Direcao invertida: {'SIM' if INVERTER_DIRECAO else 'NAO'}",
        f"Giro: {jogo['steer_suave']:.2f}",
        "",
        "Como jogar:",
        "- Segure o celular com as 2 maos",
        "- Use como se fosse volante",
        "- Gire para esquerda/direita",
        "- Pressione C quando estiver reto",
        "",
        "Teclado reserva:",
        "- seta esquerda/direita",
    ]

    y = 320
    for i, linha in enumerate(linhas):
        cor = cor_status if i == 0 else (220, 220, 220)
        txt = fonte_pequena.render(linha, True, cor)
        tela.blit(txt, (LARGURA_JOGO + 18, y))
        y += 22

    # game over
    if jogo["game_over"]:
        overlay = pygame.Surface((LARGURA_JOGO, ALTURA))
        overlay.set_alpha(170)
        overlay.fill((0, 0, 0))
        tela.blit(overlay, (0, 0))

        g1 = fonte_grande.render("GAME OVER", True, (255, 90, 90))
        g2 = fonte_media.render(f"Pontuacao final: {jogo['score']}", True, (255, 255, 255))
        g3 = fonte_media.render("Pressione R para reiniciar", True, (255, 255, 255))

        tela.blit(g1, (LARGURA_JOGO // 2 - g1.get_width() // 2, 250))
        tela.blit(g2, (LARGURA_JOGO // 2 - g2.get_width() // 2, 315))
        tela.blit(g3, (LARGURA_JOGO // 2 - g3.get_width() // 2, 370))

    pygame.display.flip()


# ============================================================
# FINALIZACAO
# ============================================================

camera.release()
hands.close()
pygame.quit()

print("Jogo encerrado.")