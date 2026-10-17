import cv2
import mediapipe as mp
import pygame
import random
import math
import time


# ============================================================
# CONFIGURACOES GERAIS
# ============================================================

LARGURA_JOGO = 700
LARGURA_CAMERA = 320
LARGURA_TOTAL = LARGURA_JOGO + LARGURA_CAMERA
ALTURA = 700

FPS = 60

CAMERA_INDEX = 0


# ============================================================
# CONFIGURACOES DO FLAPPY BIRD
# ============================================================

PASSARO_X = 160
PASSARO_RAIO = 20

GRAVIDADE = 0.45

FORCA_PULO = -8.5

VELOCIDADE_CANO = 3.5

LARGURA_CANO = 80

# Quanto maior, mais facil.
ESPACO_CANO = 210

# Tempo entre canos.
INTERVALO_CANO = 1.8


# ============================================================
# CONFIGURACOES DA MAO
# ============================================================

# Quanto menor o valor, mais proximos precisam estar
# o indicador e o polegar.

LIMITE_PINCA = 0.42

TEMPO_MINIMO_ENTRE_PULOS = 0.15


# ============================================================
# PYGAME
# ============================================================

pygame.init()

tela = pygame.display.set_mode(
    (LARGURA_TOTAL, ALTURA)
)

pygame.display.set_caption(
    "Flappy Bird controlado pela mao"
)

clock = pygame.time.Clock()


fonte_grande = pygame.font.SysFont(
    "Arial",
    44,
    bold=True
)

fonte_media = pygame.font.SysFont(
    "Arial",
    26,
    bold=True
)

fonte_pequena = pygame.font.SysFont(
    "Arial",
    20
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
        "ERRO: nao foi possivel abrir a camera."
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


def detectar_pinca(hand_landmarks):
    """
    Mede a distancia entre indicador e polegar.

    Tambem normaliza usando o tamanho da mao,
    para funcionar mesmo quando voce aproxima
    ou afasta a mao da camera.
    """

    pontos = hand_landmarks.landmark

    polegar = pontos[4]

    indicador = pontos[8]

    pulso = pontos[0]

    base_medio = pontos[9]


    distancia_dedos = distancia(
        polegar,
        indicador
    )


    tamanho_mao = distancia(
        pulso,
        base_medio
    )


    if tamanho_mao == 0:

        return False, 999


    proporcao = (
        distancia_dedos
        /
        tamanho_mao
    )


    pinca = (
        proporcao
        <
        LIMITE_PINCA
    )


    return pinca, proporcao


# ============================================================
# CLASSE DO CANO
# ============================================================

class Cano:

    def __init__(self):

        self.x = LARGURA_JOGO + 50

        margem = 130

        self.centro_gap = random.randint(
            margem + ESPACO_CANO // 2,
            ALTURA
            - margem
            - ESPACO_CANO // 2
        )

        self.passou = False


    def atualizar(self):

        self.x -= VELOCIDADE_CANO


    def desenhar(self):

        topo_final = (
            self.centro_gap
            -
            ESPACO_CANO // 2
        )

        baixo_inicio = (
            self.centro_gap
            +
            ESPACO_CANO // 2
        )


        # CANO SUPERIOR

        pygame.draw.rect(
            tela,
            (40, 190, 70),
            (
                self.x,
                0,
                LARGURA_CANO,
                topo_final
            )
        )


        pygame.draw.rect(
            tela,
            (20, 120, 40),
            (
                self.x,
                0,
                12,
                topo_final
            )
        )


        # CANO INFERIOR

        pygame.draw.rect(
            tela,
            (40, 190, 70),
            (
                self.x,
                baixo_inicio,
                LARGURA_CANO,
                ALTURA - baixo_inicio
            )
        )


        pygame.draw.rect(
            tela,
            (20, 120, 40),
            (
                self.x,
                baixo_inicio,
                12,
                ALTURA - baixo_inicio
            )
        )


    def colidiu(
        self,
        passaro_y
    ):

        topo_final = (
            self.centro_gap
            -
            ESPACO_CANO // 2
        )

        baixo_inicio = (
            self.centro_gap
            +
            ESPACO_CANO // 2
        )


        dentro_horizontal = (

            PASSARO_X
            +
            PASSARO_RAIO

            >

            self.x

            and

            PASSARO_X
            -
            PASSARO_RAIO

            <

            self.x
            +
            LARGURA_CANO
        )


        if dentro_horizontal:

            if (
                passaro_y
                -
                PASSARO_RAIO

                <
                topo_final
            ):

                return True


            if (
                passaro_y
                +
                PASSARO_RAIO

                >
                baixo_inicio
            ):

                return True


        return False


# ============================================================
# FUNCAO REINICIAR
# ============================================================

def reiniciar():

    return {
        "passaro_y": ALTURA // 2,

        "velocidade_y": 0,

        "canos": [],

        "score": 0,

        "ultimo_cano": time.time(),

        "estado": "AGUARDANDO"
    }


jogo = reiniciar()


# ============================================================
# VARIAVEIS DA PINCA
# ============================================================

pinca_anterior = False

ultima_pinca = 0

proporcao_pinca = 999

mao_detectada = False


# ============================================================
# LOOP PRINCIPAL
# ============================================================

executando = True


while executando:

    clock.tick(FPS)


    # ========================================================
    # EVENTOS
    # ========================================================

    for evento in pygame.event.get():

        if evento.type == pygame.QUIT:

            executando = False


        if evento.type == pygame.KEYDOWN:

            if evento.key == pygame.K_ESCAPE:

                executando = False


            # Controle alternativo pelo teclado.

            if evento.key == pygame.K_SPACE:

                if jogo["estado"] == "GAME_OVER":

                    jogo = reiniciar()

                else:

                    jogo["estado"] = "JOGANDO"

                    jogo["velocidade_y"] = (
                        FORCA_PULO
                    )


            if evento.key == pygame.K_r:

                jogo = reiniciar()


    # ========================================================
    # CAMERA
    # ========================================================

    sucesso, frame = camera.read()


    pinca_atual = False

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


        resultado_maos = hands.process(
            frame_rgb
        )


        if resultado_maos.multi_hand_landmarks:

            mao_detectada = True


            hand_landmarks = (
                resultado_maos
                .multi_hand_landmarks[0]
            )


            pinca_atual, proporcao_pinca = (
                detectar_pinca(
                    hand_landmarks
                )
            )


            # Desenha esqueleto.

            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles
                .get_default_hand_landmarks_style(),
                mp_drawing_styles
                .get_default_hand_connections_style()
            )


            # Marca polegar e indicador.

            altura_cam, largura_cam, _ = (
                frame.shape
            )


            polegar = (
                hand_landmarks
                .landmark[4]
            )


            indicador = (
                hand_landmarks
                .landmark[8]
            )


            ponto_polegar = (

                int(
                    polegar.x
                    *
                    largura_cam
                ),

                int(
                    polegar.y
                    *
                    altura_cam
                )
            )


            ponto_indicador = (

                int(
                    indicador.x
                    *
                    largura_cam
                ),

                int(
                    indicador.y
                    *
                    altura_cam
                )
            )


            cv2.circle(
                frame,
                ponto_polegar,
                10,
                (0, 255, 255),
                -1
            )


            cv2.circle(
                frame,
                ponto_indicador,
                10,
                (0, 255, 255),
                -1
            )


            cv2.line(
                frame,
                ponto_polegar,
                ponto_indicador,
                (0, 255, 255),
                3
            )


    # ========================================================
    # DETECTAR NOVA PINCA
    # ========================================================

    agora = time.time()


    nova_pinca = (

        pinca_atual

        and

        not pinca_anterior

        and

        agora
        -
        ultima_pinca

        >
        TEMPO_MINIMO_ENTRE_PULOS
    )


    if nova_pinca:

        ultima_pinca = agora


        # ====================================================
        # GAME OVER -> REINICIAR
        # ====================================================

        if jogo["estado"] == "GAME_OVER":

            jogo = reiniciar()

            jogo["estado"] = "JOGANDO"

            jogo["velocidade_y"] = (
                FORCA_PULO
            )


        # ====================================================
        # INICIAR OU PULAR
        # ====================================================

        else:

            jogo["estado"] = "JOGANDO"

            jogo["velocidade_y"] = (
                FORCA_PULO
            )


    pinca_anterior = pinca_atual


    # ========================================================
    # ATUALIZAR JOGO
    # ========================================================

    if jogo["estado"] == "JOGANDO":


        # ----------------------------------------------------
        # FISICA DO PASSARO
        # ----------------------------------------------------

        jogo["velocidade_y"] += (
            GRAVIDADE
        )


        jogo["passaro_y"] += (
            jogo["velocidade_y"]
        )


        # ----------------------------------------------------
        # CRIAR CANOS
        # ----------------------------------------------------

        if (
            time.time()
            -
            jogo["ultimo_cano"]

            >=

            INTERVALO_CANO
        ):

            jogo["canos"].append(
                Cano()
            )

            jogo["ultimo_cano"] = (
                time.time()
            )


        # ----------------------------------------------------
        # ATUALIZAR CANOS
        # ----------------------------------------------------

        for cano in jogo["canos"]:

            cano.atualizar()


            # SCORE

            if (
                not cano.passou

                and

                cano.x
                +
                LARGURA_CANO

                <

                PASSARO_X
            ):

                cano.passou = True

                jogo["score"] += 1


            # COLISAO

            if cano.colidiu(
                jogo["passaro_y"]
            ):

                jogo["estado"] = (
                    "GAME_OVER"
                )


        # Remove canos antigos.

        jogo["canos"] = [

            cano

            for cano
            in jogo["canos"]

            if
            cano.x
            >
            -LARGURA_CANO
        ]


        # ----------------------------------------------------
        # TETO / CHAO
        # ----------------------------------------------------

        if (
            jogo["passaro_y"]
            -
            PASSARO_RAIO

            <=

            0
        ):

            jogo["estado"] = (
                "GAME_OVER"
            )


        if (
            jogo["passaro_y"]
            +
            PASSARO_RAIO

            >=

            ALTURA
        ):

            jogo["estado"] = (
                "GAME_OVER"
            )


    # ========================================================
    # DESENHAR FUNDO
    # ========================================================

    tela.fill(
        (90, 190, 235)
    )


    # Nuvens simples.

    pygame.draw.circle(
        tela,
        (230, 245, 250),
        (100, 100),
        40
    )

    pygame.draw.circle(
        tela,
        (230, 245, 250),
        (140, 90),
        50
    )

    pygame.draw.circle(
        tela,
        (230, 245, 250),
        (180, 105),
        35
    )


    # ========================================================
    # DESENHAR CANOS
    # ========================================================

    for cano in jogo["canos"]:

        cano.desenhar()


    # ========================================================
    # PASSARO
    # ========================================================

    passaro_y_int = int(
        jogo["passaro_y"]
    )


    # Corpo.

    pygame.draw.circle(
        tela,
        (255, 220, 0),
        (
            PASSARO_X,
            passaro_y_int
        ),
        PASSARO_RAIO
    )


    # Asa.

    pygame.draw.ellipse(
        tela,
        (255, 170, 0),
        (
            PASSARO_X - 15,
            passaro_y_int + 3,
            24,
            14
        )
    )


    # Olho.

    pygame.draw.circle(
        tela,
        (255, 255, 255),
        (
            PASSARO_X + 9,
            passaro_y_int - 7
        ),
        7
    )


    pygame.draw.circle(
        tela,
        (0, 0, 0),
        (
            PASSARO_X + 12,
            passaro_y_int - 7
        ),
        3
    )


    # Bico.

    pygame.draw.polygon(
        tela,
        (255, 100, 0),
        [
            (
                PASSARO_X + 18,
                passaro_y_int
            ),

            (
                PASSARO_X + 35,
                passaro_y_int + 5
            ),

            (
                PASSARO_X + 18,
                passaro_y_int + 10
            )
        ]
    )


    # ========================================================
    # SCORE
    # ========================================================

    texto_score = fonte_grande.render(
        str(jogo["score"]),
        True,
        (255, 255, 255)
    )


    tela.blit(
        texto_score,
        (
            LARGURA_JOGO // 2
            -
            texto_score.get_width() // 2,

            30
        )
    )


    # ========================================================
    # LINHA DIVISORIA DA CAMERA
    # ========================================================

    pygame.draw.rect(
        tela,
        (25, 25, 25),
        (
            LARGURA_JOGO,
            0,
            LARGURA_CAMERA,
            ALTURA
        )
    )


    # ========================================================
    # MOSTRAR CAMERA NO PYGAME
    # ========================================================

    if sucesso:

        camera_mostrar = cv2.resize(
            frame,
            (
                LARGURA_CAMERA,
                240
            )
        )


        camera_mostrar = cv2.cvtColor(
            camera_mostrar,
            cv2.COLOR_BGR2RGB
        )


        superficie_camera = (
            pygame.image.frombuffer(
                camera_mostrar.tobytes(),
                (
                    LARGURA_CAMERA,
                    240
                ),
                "RGB"
            )
        )


        tela.blit(
            superficie_camera,
            (
                LARGURA_JOGO,
                0
            )
        )


    # ========================================================
    # INFORMACOES DA MAO
    # ========================================================

    titulo = fonte_media.render(
        "CONTROLE PELA MAO",
        True,
        (255, 255, 255)
    )


    tela.blit(
        titulo,
        (
            LARGURA_JOGO + 25,
            270
        )
    )


    if not mao_detectada:

        texto = "MAO NAO DETECTADA"

        cor = (
            255,
            100,
            100
        )


    elif pinca_atual:

        texto = "PINCA! PULO!"

        cor = (
            0,
            255,
            100
        )


    else:

        texto = "ABRA E FACA A PINCA"

        cor = (
            255,
            255,
            255
        )


    status = fonte_pequena.render(
        texto,
        True,
        cor
    )


    tela.blit(
        status,
        (
            LARGURA_JOGO + 30,
            320
        )
    )


    valor = fonte_pequena.render(
        f"Pinça: {proporcao_pinca:.2f}",
        True,
        (180, 180, 180)
    )


    tela.blit(
        valor,
        (
            LARGURA_JOGO + 30,
            360
        )
    )


    instrucoes = [
        "Polegar + indicador",
        "",
        "Encoste:",
        "passaro pula",
        "",
        "Abra os dedos",
        "e faca outra pinca",
        "para pular novamente.",
        "",
        "ESC = sair",
        "R = reiniciar",
        "ESPACO = controle reserva"
    ]


    y = 410


    for linha in instrucoes:

        texto_linha = fonte_pequena.render(
            linha,
            True,
            (220, 220, 220)
        )

        tela.blit(
            texto_linha,
            (
                LARGURA_JOGO + 25,
                y
            )
        )

        y += 23


    # ========================================================
    # TELA INICIAL
    # ========================================================

    if jogo["estado"] == "AGUARDANDO":

        mensagem = fonte_grande.render(
            "FACA UMA PINCA!",
            True,
            (255, 255, 255)
        )


        tela.blit(
            mensagem,
            (
                LARGURA_JOGO // 2
                -
                mensagem.get_width() // 2,

                ALTURA // 2 - 70
            )
        )


        explicacao = fonte_media.render(
            "Polegar + indicador",
            True,
            (255, 255, 255)
        )


        tela.blit(
            explicacao,
            (
                LARGURA_JOGO // 2
                -
                explicacao.get_width() // 2,

                ALTURA // 2
            )
        )


    # ========================================================
    # GAME OVER
    # ========================================================

    if jogo["estado"] == "GAME_OVER":

        fundo = pygame.Surface(
            (
                LARGURA_JOGO,
                ALTURA
            )
        )

        fundo.set_alpha(
            150
        )

        fundo.fill(
            (0, 0, 0)
        )

        tela.blit(
            fundo,
            (0, 0)
        )


        game_over = fonte_grande.render(
            "GAME OVER",
            True,
            (255, 80, 80)
        )


        tela.blit(
            game_over,
            (
                LARGURA_JOGO // 2
                -
                game_over.get_width() // 2,

                260
            )
        )


        score_final = fonte_media.render(
            f"Pontos: {jogo['score']}",
            True,
            (255, 255, 255)
        )


        tela.blit(
            score_final,
            (
                LARGURA_JOGO // 2
                -
                score_final.get_width() // 2,

                330
            )
        )


        reiniciar_texto = (
            fonte_media.render(
                "Faca uma pinca para reiniciar",
                True,
                (255, 255, 255)
            )
        )


        tela.blit(
            reiniciar_texto,
            (
                LARGURA_JOGO // 2
                -
                reiniciar_texto.get_width() // 2,

                390
            )
        )


    # ========================================================
    # ATUALIZAR TELA
    # ========================================================

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