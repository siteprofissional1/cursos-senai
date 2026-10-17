import cv2
import mediapipe as mp
import math
import time
import winsound


# ============================================================
# CONFIGURACOES
# ============================================================

CAMERA_INDEX = 0

# Quanto menor, mais fechado o olho esta.
# Normalmente algo entre 0.18 e 0.25 funciona bem.
LIMITE_OLHO_FECHADO = 0.21

# Quantos segundos os olhos precisam ficar fechados
# antes do alarme tocar.
TEMPO_PARA_ALARME = 1.3

# Frequencia e duracao do som no Windows.
FREQUENCIA_ALARME = 1800
DURACAO_ALARME_MS = 500


# ============================================================
# MEDIAPIPE FACE MESH
# ============================================================

mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils


face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)


# ============================================================
# LANDMARKS DOS OLHOS
# ============================================================

# Pontos do MediaPipe usados para calcular o Eye Aspect Ratio.

OLHO_ESQUERDO = [
    33,     # canto esquerdo
    160,    # superior 1
    158,    # superior 2
    133,    # canto direito
    153,    # inferior 1
    144     # inferior 2
]

OLHO_DIREITO = [
    362,
    385,
    387,
    263,
    373,
    380
]


# ============================================================
# FUNCOES
# ============================================================

def distancia(p1, p2):
    """
    Distancia euclidiana entre dois pontos.
    """

    return math.sqrt(
        (p1[0] - p2[0]) ** 2 +
        (p1[1] - p2[1]) ** 2
    )


def pegar_ponto(landmarks, indice, largura, altura):

    ponto = landmarks[indice]

    return (
        int(ponto.x * largura),
        int(ponto.y * altura)
    )


def calcular_ear(landmarks, indices, largura, altura):
    """
    Calcula o Eye Aspect Ratio (EAR).

    Olho aberto  -> valor maior
    Olho fechado -> valor menor
    """

    p1 = pegar_ponto(
        landmarks,
        indices[0],
        largura,
        altura
    )

    p2 = pegar_ponto(
        landmarks,
        indices[1],
        largura,
        altura
    )

    p3 = pegar_ponto(
        landmarks,
        indices[2],
        largura,
        altura
    )

    p4 = pegar_ponto(
        landmarks,
        indices[3],
        largura,
        altura
    )

    p5 = pegar_ponto(
        landmarks,
        indices[4],
        largura,
        altura
    )

    p6 = pegar_ponto(
        landmarks,
        indices[5],
        largura,
        altura
    )


    vertical1 = distancia(p2, p6)

    vertical2 = distancia(p3, p5)

    horizontal = distancia(p1, p4)


    if horizontal == 0:
        return 0


    ear = (
        vertical1 + vertical2
    ) / (2.0 * horizontal)


    return ear


def desenhar_olho(
    frame,
    landmarks,
    indices,
    largura,
    altura
):

    pontos = []

    for indice in indices:

        ponto = pegar_ponto(
            landmarks,
            indice,
            largura,
            altura
        )

        pontos.append(ponto)

        cv2.circle(
            frame,
            ponto,
            3,
            (0, 255, 255),
            -1
        )


    # Desenha linhas entre alguns pontos.
    cv2.line(
        frame,
        pontos[0],
        pontos[3],
        (255, 255, 0),
        1
    )

    cv2.line(
        frame,
        pontos[1],
        pontos[5],
        (255, 255, 0),
        1
    )

    cv2.line(
        frame,
        pontos[2],
        pontos[4],
        (255, 255, 0),
        1
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
    1280
)

camera.set(
    cv2.CAP_PROP_FRAME_HEIGHT,
    720
)


if not camera.isOpened():

    print(
        "ERRO: nao foi possivel abrir a camera."
    )

    exit()


print()
print("Detector de sonolencia iniciado.")
print("Pressione Q para sair.")
print()


# ============================================================
# VARIAVEIS
# ============================================================

inicio_olhos_fechados = None

alarme_ativo = False

ultimo_alarme = 0


# ============================================================
# LOOP PRINCIPAL
# ============================================================

while True:

    sucesso, frame = camera.read()

    if not sucesso:

        print(
            "Erro ao capturar imagem."
        )

        break


    # Espelha como um espelho.
    frame = cv2.flip(
        frame,
        1
    )


    altura, largura, _ = frame.shape


    # Converte BGR para RGB.
    frame_rgb = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )


    resultado = face_mesh.process(
        frame_rgb
    )


    estado = "ROSTO NAO DETECTADO"

    cor_estado = (
        0,
        165,
        255
    )


    # ========================================================
    # ROSTO DETECTADO
    # ========================================================

    if resultado.multi_face_landmarks:

        face_landmarks = (
            resultado
            .multi_face_landmarks[0]
            .landmark
        )


        # ====================================================
        # CALCULAR ABERTURA DOS OLHOS
        # ====================================================

        ear_esquerdo = calcular_ear(
            face_landmarks,
            OLHO_ESQUERDO,
            largura,
            altura
        )


        ear_direito = calcular_ear(
            face_landmarks,
            OLHO_DIREITO,
            largura,
            altura
        )


        ear_medio = (
            ear_esquerdo +
            ear_direito
        ) / 2


        # ====================================================
        # DESENHAR PONTOS DOS OLHOS
        # ====================================================

        desenhar_olho(
            frame,
            face_landmarks,
            OLHO_ESQUERDO,
            largura,
            altura
        )


        desenhar_olho(
            frame,
            face_landmarks,
            OLHO_DIREITO,
            largura,
            altura
        )


        # ====================================================
        # DETECTAR OLHOS FECHADOS
        # ====================================================

        if ear_medio < LIMITE_OLHO_FECHADO:

            estado = "OLHOS FECHADOS"

            cor_estado = (
                0,
                0,
                255
            )


            if inicio_olhos_fechados is None:

                inicio_olhos_fechados = (
                    time.time()
                )


            tempo_fechado = (
                time.time()
                -
                inicio_olhos_fechados
            )


            # =================================================
            # ALARME
            # =================================================

            if (
                tempo_fechado
                >=
                TEMPO_PARA_ALARME
            ):

                estado = (
                    "ACORDA!!!"
                )


                # Evita criar centenas de beeps.
                if (
                    time.time()
                    -
                    ultimo_alarme
                    >
                    0.6
                ):

                    winsound.Beep(
                        FREQUENCIA_ALARME,
                        DURACAO_ALARME_MS
                    )

                    ultimo_alarme = (
                        time.time()
                    )


            # Mostra quanto tempo esta fechado.
            cv2.putText(
                frame,
                f"Fechado: {tempo_fechado:.1f}s",
                (30, 155),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (0, 0, 255),
                2
            )


        else:

            estado = "ACORDADO"

            cor_estado = (
                0,
                255,
                0
            )

            inicio_olhos_fechados = None


        # ====================================================
        # MOSTRAR EAR
        # ====================================================

        cv2.putText(
            frame,
            f"EAR: {ear_medio:.3f}",
            (30, 110),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2
        )


    else:

        inicio_olhos_fechados = None


    # ========================================================
    # PAINEL SUPERIOR
    # ========================================================

    cv2.rectangle(
        frame,
        (10, 10),
        (480, 75),
        (0, 0, 0),
        -1
    )


    cv2.putText(
        frame,
        estado,
        (30, 55),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.2,
        cor_estado,
        3
    )


    # ========================================================
    # ALERTA VISUAL
    # ========================================================

    if estado == "ACORDA!!!":

        cv2.rectangle(
            frame,
            (0, 0),
            (largura - 1, altura - 1),
            (0, 0, 255),
            15
        )


        cv2.putText(
            frame,
            "SONOLENCIA DETECTADA!",
            (int(largura * 0.20),
             int(altura * 0.80)),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.5,
            (0, 0, 255),
            4
        )


    # ========================================================
    # MOSTRAR TELA
    # ========================================================

    cv2.imshow(
        "Detector de Sonolencia",
        frame
    )


    tecla = (
        cv2.waitKey(1)
        &
        0xFF
    )


    if (
        tecla == ord("q")
        or
        tecla == 27
    ):

        break


# ============================================================
# FINALIZACAO
# ============================================================

camera.release()

face_mesh.close()

cv2.destroyAllWindows()

print(
    "Detector encerrado."
)