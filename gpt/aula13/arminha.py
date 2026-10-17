import cv2
import mediapipe as mp
import pygame
import random
import time
import math


# ============================================================
# CONFIGURACOES
# ============================================================

LARGURA_JOGO = 800
LARGURA_CAMERA = 320
LARGURA_TOTAL = LARGURA_JOGO + LARGURA_CAMERA

ALTURA = 650

FPS = 60

CAMERA_INDEX = 0

COOLDOWN_TIRO = 0.30

VIDAS_INICIAIS = 5


# ============================================================
# PYGAME
# ============================================================

pygame.init()

tela = pygame.display.set_mode(
    (
        LARGURA_TOTAL,
        ALTURA
    )
)

pygame.display.set_caption(
    "Jogo de tiro controlado pela mao"
)

clock = pygame.time.Clock()

fonte_grande = pygame.font.SysFont(
    "Arial",
    40,
    bold=True
)

fonte_media = pygame.font.SysFont(
    "Arial",
    25,
    bold=True
)

fonte_pequena = pygame.font.SysFont(
    "Arial",
    19
)


# ============================================================
# MEDIAPIPE
# ============================================================

mp_hands = mp.solutions.hands

mp_drawing = mp.solutions.drawing_utils

mp_drawing_styles = (
    mp.solutions.drawing_styles
)


hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)


# ============================================================
# CAMERA
# ============================================================

camera = cv2.VideoCapture(
    CAMERA_INDEX,
    cv2.CAP_DSHOW
)

camera.set(
    cv2.CAP_PROP_FRAME_WIDTH,
    640
)

camera.set(
    cv2.CAP_PROP_FRAME_HEIGHT,
    480
)


if not camera.isOpened():

    print(
        "ERRO: camera nao encontrada."
    )

    pygame.quit()

    exit()


# ============================================================
# FUNCOES DA MAO
# ============================================================

def distancia(p1, p2):

    return math.sqrt(
        (p1.x - p2.x) ** 2
        +
        (p1.y - p2.y) ** 2
    )


def dedo_estendido(pontos, ponta, articulacao):

    return (
        pontos[ponta].y
        <
        pontos[articulacao].y
    )


def gesto_arminha(hand_landmarks):
    """
    Detecta:
    - indicador esticado
    - medio fechado
    - anelar fechado
    - mindinho fechado
    - polegar afastado
    """

    p = hand_landmarks.landmark


    indicador = dedo_estendido(
        p,
        8,
        6
    )


    medio = dedo_estendido(
        p,
        12,
        10
    )


    anelar = dedo_estendido(
        p,
        16,
        14
    )


    mindinho = dedo_estendido(
        p,
        20,
        18
    )


    # Distancia entre polegar e indicador.
    # No gesto de arminha normalmente ficam separados.

    dist_polegar = distancia(
        p[4],
        p[5]
    )


    dist_referencia = distancia(
        p[0],
        p[9]
    )


    if dist_referencia == 0:

        return False


    polegar_aberto = (
        dist_polegar
        /
        dist_referencia
        >
        0.45
    )


    return (
        indicador
        and
        not medio
        and
        not anelar
        and
        not mindinho
        and
        polegar_aberto
    )


# ============================================================
# MONSTROS
# ============================================================

class Monstro:

    def __init__(self):

        self.raio = random.randint(
            28,
            45
        )

        self.x = random.randint(
            100,
            LARGURA_JOGO - 100
        )

        self.y = random.randint(
            130,
            ALTURA - 100
        )

        self.vel_x = random.choice(
            [-1, 1]
        ) * random.uniform(
            1,
            2.5
        )

        self.vel_y = random.choice(
            [-1, 1]
        ) * random.uniform(
            0.5,
            1.5
        )

        self.cor = random.choice(
            [
                (200, 60, 80),
                (80, 200, 100),
                (150, 80, 220),
                (220, 160, 60)
            ]
        )


    def atualizar(self):

        self.x += self.vel_x

        self.y += self.vel_y


        if (
            self.x
            <
            self.raio
            or
            self.x
            >
            LARGURA_JOGO
            -
            self.raio
        ):

            self.vel_x *= -1


        if (
            self.y
            <
            100
            or
            self.y
            >
            ALTURA
            -
            self.raio
        ):

            self.vel_y *= -1


    def desenhar(self):

        pygame.draw.circle(
            tela,
            self.cor,
            (
                int(self.x),
                int(self.y)
            ),
            self.raio
        )


        # Olhos

        pygame.draw.circle(
            tela,
            (255, 255, 255),
            (
                int(self.x - 12),
                int(self.y - 8)
            ),
            7
        )


        pygame.draw.circle(
            tela,
            (255, 255, 255),
            (
                int(self.x + 12),
                int(self.y - 8)
            ),
            7
        )


        pygame.draw.circle(
            tela,
            (0, 0, 0),
            (
                int(self.x - 12),
                int(self.y - 8)
            ),
            3
        )


        pygame.draw.circle(
            tela,
            (0, 0, 0),
            (
                int(self.x + 12),
                int(self.y - 8)
            ),
            3
        )


        pygame.draw.line(
            tela,
            (0, 0, 0),
            (
                int(self.x - 14),
                int(self.y + 15)
            ),
            (
                int(self.x + 14),
                int(self.y + 15)
            ),
            4
        )


    def acertado(
        self,
        mira_x,
        mira_y
    ):

        d = math.sqrt(
            (self.x - mira_x) ** 2
            +
            (self.y - mira_y) ** 2
        )

        return d <= self.raio + 12


# ============================================================
# ESTADO
# ============================================================

monstros = []

pontos = 0

vidas = VIDAS_INICIAIS

ultimo_spawn = 0

ultimo_tiro = 0

flash_tiro = 0

mira_x = (
    LARGURA_JOGO // 2
)

mira_y = (
    ALTURA // 2
)

gesto_detectado = False

mao_detectada = False

camera_surface = None


# ============================================================
# LOOP
# ============================================================

executando = True


while executando:

    clock.tick(FPS)

    agora = time.time()


    # ========================================================
    # EVENTOS
    # ========================================================

    for evento in pygame.event.get():

        if evento.type == pygame.QUIT:

            executando = False


        if evento.type == pygame.KEYDOWN:

            if evento.key == pygame.K_ESCAPE:

                executando = False


            if evento.key == pygame.K_r:

                monstros.clear()

                pontos = 0

                vidas = VIDAS_INICIAIS


    # ========================================================
    # CAMERA
    # ========================================================

    sucesso, frame = camera.read()

    gesto_detectado = False

    mao_detectada = False


    if sucesso:

        frame = cv2.flip(
            frame,
            1
        )


        frame_rgb = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )


        resultado = hands.process(
            frame_rgb
        )


        if resultado.multi_hand_landmarks:

            mao_detectada = True


            mao = (
                resultado
                .multi_hand_landmarks[0]
            )


            gesto_detectado = (
                gesto_arminha(
                    mao
                )
            )


            mp_drawing.draw_landmarks(
                frame,
                mao,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles
                .get_default_hand_landmarks_style(),
                mp_drawing_styles
                .get_default_hand_connections_style()
            )


            # =================================================
            # PONTA DO INDICADOR
            # =================================================

            indicador = (
                mao.landmark[8]
            )


            # Converte posicao da camera
            # em posicao dentro do jogo.

            mira_x = int(
                indicador.x
                *
                LARGURA_JOGO
            )

            mira_y = int(
                indicador.y
                *
                ALTURA
            )


            # Limites

            mira_x = max(
                0,
                min(
                    LARGURA_JOGO,
                    mira_x
                )
            )


            mira_y = max(
                0,
                min(
                    ALTURA,
                    mira_y
                )
            )


        # ====================================================
        # MOSTRAR CAMERA
        # ====================================================

        cam = cv2.resize(
            frame,
            (
                LARGURA_CAMERA,
                240
            )
        )


        cam = cv2.cvtColor(
            cam,
            cv2.COLOR_BGR2RGB
        )


        camera_surface = (
            pygame.image.frombuffer(
                cam.tobytes(),
                (
                    LARGURA_CAMERA,
                    240
                ),
                "RGB"
            )
        )


    # ========================================================
    # DISPARO
    # ========================================================

    if (
        gesto_detectado

        and

        agora
        -
        ultimo_tiro

        >=

        COOLDOWN_TIRO
    ):

        ultimo_tiro = agora

        flash_tiro = (
            agora
            +
            0.08
        )


        # ====================================================
        # VERIFICAR ACERTO
        # ====================================================

        monstros_restantes = []


        acertou = False


        for monstro in monstros:

            if monstro.acertado(
                mira_x,
                mira_y
            ):

                pontos += 1

                acertou = True


            else:

                monstros_restantes.append(
                    monstro
                )


        monstros = (
            monstros_restantes
        )


    # ========================================================
    # SPAWN DOS MONSTROS
    # ========================================================

    intervalo = max(
        0.5,
        1.4
        -
        pontos
        *
        0.02
    )


    if (
        agora
        -
        ultimo_spawn

        >=

        intervalo
    ):

        monstros.append(
            Monstro()
        )

        ultimo_spawn = agora


    # Limite de inimigos

    if len(monstros) > 10:

        vidas -= 1

        monstros.pop(0)


    # ========================================================
    # ATUALIZAR MONSTROS
    # ========================================================

    for monstro in monstros:

        monstro.atualizar()


    # ========================================================
    # FUNDO
    # ========================================================

    tela.fill(
        (25, 30, 45)
    )


    # Campo de jogo.

    pygame.draw.rect(
        tela,
        (45, 55, 80),
        (
            0,
            0,
            LARGURA_JOGO,
            ALTURA
        )
    )


    # ========================================================
    # MONSTROS
    # ========================================================

    for monstro in monstros:

        monstro.desenhar()


    # ========================================================
    # MIRA
    # ========================================================

    cor_mira = (
        255,
        255,
        255
    )


    if gesto_detectado:

        cor_mira = (
            255,
            80,
            80
        )


    pygame.draw.circle(
        tela,
        cor_mira,
        (
            mira_x,
            mira_y
        ),
        22,
        3
    )


    pygame.draw.line(
        tela,
        cor_mira,
        (
            mira_x - 32,
            mira_y
        ),
        (
            mira_x + 32,
            mira_y
        ),
        3
    )


    pygame.draw.line(
        tela,
        cor_mira,
        (
            mira_x,
            mira_y - 32
        ),
        (
            mira_x,
            mira_y + 32
        ),
        3
    )


    # ========================================================
    # EFEITO DO TIRO
    # ========================================================

    if agora < flash_tiro:

        pygame.draw.circle(
            tela,
            (255, 230, 80),
            (
                mira_x,
                mira_y
            ),
            40,
            6
        )


        texto_tiro = (
            fonte_grande.render(
                "BANG!",
                True,
                (255, 240, 80)
            )
        )


        tela.blit(
            texto_tiro,
            (
                mira_x + 35,
                mira_y - 55
            )
        )


    # ========================================================
    # HUD
    # ========================================================

    texto_pontos = fonte_grande.render(
        f"Pontos: {pontos}",
        True,
        (255, 255, 255)
    )


    tela.blit(
        texto_pontos,
        (
            20,
            20
        )
    )


    texto_vidas = fonte_media.render(
        f"Vidas: {vidas}",
        True,
        (255, 220, 120)
    )


    tela.blit(
        texto_vidas,
        (
            22,
            70
        )
    )


    # ========================================================
    # PAINEL CAMERA
    # ========================================================

    pygame.draw.rect(
        tela,
        (20, 20, 25),
        (
            LARGURA_JOGO,
            0,
            LARGURA_CAMERA,
            ALTURA
        )
    )


    if camera_surface:

        tela.blit(
            camera_surface,
            (
                LARGURA_JOGO,
                0
            )
        )


    titulo = fonte_media.render(
        "CONTROLE PELA MAO",
        True,
        (255, 255, 255)
    )


    tela.blit(
        titulo,
        (
            LARGURA_JOGO + 35,
            270
        )
    )


    if not mao_detectada:

        status = "MAO NAO DETECTADA"

        cor = (
            255,
            100,
            100
        )


    elif gesto_detectado:

        status = "ARMINHA = ATIRANDO"

        cor = (
            0,
            255,
            100
        )


    else:

        status = "FAÇA O GESTO"

        cor = (
            255,
            255,
            255
        )


    texto_status = (
        fonte_pequena.render(
            status,
            True,
            cor
        )
    )


    tela.blit(
        texto_status,
        (
            LARGURA_JOGO + 30,
            320
        )
    )


    instrucoes = [
        "",
        "Gesto:",
        "",
        "Indicador esticado",
        "Polegar aberto",
        "",
        "Medio fechado",
        "Anelar fechado",
        "Mindinho fechado",
        "",
        "A ponta do indicador",
        "controla a mira.",
        "",
        "R = reiniciar",
        "ESC = sair"
    ]


    y = 345


    for linha in instrucoes:

        txt = fonte_pequena.render(
            linha,
            True,
            (210, 210, 210)
        )

        tela.blit(
            txt,
            (
                LARGURA_JOGO + 30,
                y
            )
        )

        y += 21


    # ========================================================
    # GAME OVER
    # ========================================================

    if vidas <= 0:

        overlay = pygame.Surface(
            (
                LARGURA_JOGO,
                ALTURA
            )
        )

        overlay.set_alpha(
            180
        )

        overlay.fill(
            (0, 0, 0)
        )


        tela.blit(
            overlay,
            (
                0,
                0
            )
        )


        txt = fonte_grande.render(
            "GAME OVER",
            True,
            (255, 80, 80)
        )


        tela.blit(
            txt,
            (
                LARGURA_JOGO // 2
                -
                txt.get_width() // 2,

                280
            )
        )


        txt2 = fonte_media.render(
            f"Pontos: {pontos}",
            True,
            (255, 255, 255)
        )


        tela.blit(
            txt2,
            (
                LARGURA_JOGO // 2
                -
                txt2.get_width() // 2,

                340
            )
        )


        txt3 = fonte_media.render(
            "Pressione R",
            True,
            (255, 255, 255)
        )


        tela.blit(
            txt3,
            (
                LARGURA_JOGO // 2
                -
                txt3.get_width() // 2,

                390
            )
        )


    pygame.display.flip()


# ============================================================
# FINALIZAR
# ============================================================

camera.release()

hands.close()

pygame.quit()

print(
    "Jogo encerrado."
)