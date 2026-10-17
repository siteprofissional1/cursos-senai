import cv2
import mediapipe as mp
import torch
import time
import os

from ultralytics import YOLOWorld


# ============================================================
# CONFIGURACOES
# ============================================================

CAMERA_INDEX = 0

# Confianca minima do detector.
# Se estiver deixando de reconhecer objetos, experimente 0.10.
CONFIDENCE = 0.08

# Executa YOLO a cada X frames.
# 1 = todos os frames
# 2 = mais leve
YOLO_EVERY_N_FRAMES = 2


# ============================================================
# YOLO-WORLD
# ============================================================

print("Carregando YOLO-World...")

model = YOLOWorld("yolov8s-worldv2.pt")

# Objetos que queremos procurar.
model.set_classes([
    "cell phone",
    "bottle",
    "computer mouse",
    "box",
    "white box",
    "cardboard box",
    "product box",
    "product packaging",
    "electronics box",
    "computer accessory box",
    "computer mouse box",
    "computer mouse packaging"
])

# Nomes em portugues para mostrar na tela.
NOMES_PT = {
    "cell phone": "CELULAR",
    "bottle": "GARRAFA",
    "computer mouse": "MOUSE",

    "box": "CAIXA",
    "white box": "CAIXA",
    "cardboard box": "CAIXA",
    "product box": "CAIXA DE PRODUTO",
    "product packaging": "EMBALAGEM",
    "electronics box": "CAIXA DE ELETRONICO",
    "computer accessory box": "CAIXA DE ACESSORIO",
    "computer mouse box": "CAIXA DO MOUSE",
    "computer mouse packaging": "CAIXA DO MOUSE"
}


# ============================================================
# GPU / CPU
# ============================================================

if torch.cuda.is_available():
    device = 0
    print("GPU encontrada:")
    print(torch.cuda.get_device_name(0))
else:
    device = "cpu"
    print("GPU CUDA nao encontrada. Usando CPU.")


# ============================================================
# MEDIAPIPE HANDS
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
# FUNCAO PARA CONTAR DEDOS
# ============================================================

def contar_dedos(hand_landmarks, handedness):
    """
    Recebe os pontos da mao detectada pelo MediaPipe
    e retorna quantos dedos estao levantados.
    """

    pontos = hand_landmarks.landmark

    total = 0

    # --------------------------------------------------------
    # POLEGAR
    # --------------------------------------------------------

    # Como a imagem esta espelhada, verificamos a direcao
    # horizontal do polegar dependendo da mao.

    if handedness == "Right":
        if pontos[4].x < pontos[3].x:
            total += 1

    elif handedness == "Left":
        if pontos[4].x > pontos[3].x:
            total += 1

    # --------------------------------------------------------
    # INDICADOR, MEDIO, ANELAR E MINIMO
    # --------------------------------------------------------

    dedos = [
        (8, 6),    # indicador
        (12, 10),  # medio
        (16, 14),  # anelar
        (20, 18)   # minimo
    ]

    for ponta, articulacao in dedos:

        # Quanto menor Y, mais alto o ponto esta na imagem.
        if pontos[ponta].y < pontos[articulacao].y:
            total += 1

    return total


# ============================================================
# CAMERA
# ============================================================

if os.name == "nt":
    camera = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
else:
    camera = cv2.VideoCapture(CAMERA_INDEX)


camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)


if not camera.isOpened():
    print("ERRO: nao foi possivel abrir a camera.")
    exit()


print()
print("Camera iniciada.")
print("Pressione Q para sair.")
print()


# ============================================================
# VARIAVEIS
# ============================================================

contador_frames = 0

deteccoes_anteriores = []

tempo_anterior = time.time()


# ============================================================
# LOOP PRINCIPAL
# ============================================================

while True:

    sucesso, frame = camera.read()

    if not sucesso:
        print("Erro ao capturar imagem.")
        break

    # Espelha a imagem como se fosse um espelho.
    frame = cv2.flip(frame, 1)

    altura, largura, _ = frame.shape

    contador_frames += 1


    # ========================================================
    # DETECCAO DE OBJETOS
    # ========================================================

    if contador_frames % YOLO_EVERY_N_FRAMES == 0:

        resultados = model.predict(
            frame,
            conf=CONFIDENCE,
            imgsz=960,
            device=device,
            verbose=False
        )

        deteccoes_anteriores = []

        resultado = resultados[0]

        if resultado.boxes is not None:

            for box in resultado.boxes:

                x1, y1, x2, y2 = map(
                    int,
                    box.xyxy[0].tolist()
                )

                confianca = float(box.conf[0])

                classe_id = int(box.cls[0])

                nome_original = model.names[classe_id]

                nome_pt = NOMES_PT.get(
                    nome_original,
                    nome_original.upper()
                )

                deteccoes_anteriores.append(
                    (
                        x1,
                        y1,
                        x2,
                        y2,
                        nome_pt,
                        confianca
                    )
                )


    # ========================================================
    # DESENHAR OBJETOS
    # ========================================================

    for (
        x1,
        y1,
        x2,
        y2,
        nome,
        confianca
    ) in deteccoes_anteriores:

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        texto = f"{nome} {confianca * 100:.0f}%"

        cv2.putText(
            frame,
            texto,
            (x1, max(y1 - 10, 25)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )


    # ========================================================
    # DETECCAO DAS MAOS
    # ========================================================

    frame_rgb = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    resultado_maos = hands.process(frame_rgb)

    total_dedos = 0


    # ========================================================
    # PROCESSAR CADA MAO
    # ========================================================

    if resultado_maos.multi_hand_landmarks:

        for indice, hand_landmarks in enumerate(
            resultado_maos.multi_hand_landmarks
        ):

            # Descobre se e mao esquerda ou direita.
            handedness = (
                resultado_maos
                .multi_handedness[indice]
                .classification[0]
                .label
            )

            dedos = contar_dedos(
                hand_landmarks,
                handedness
            )

            total_dedos += dedos


            # ------------------------------------------------
            # DESENHAR ESQUELETO DA MAO
            # ------------------------------------------------

            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles
                .get_default_hand_landmarks_style(),
                mp_drawing_styles
                .get_default_hand_connections_style()
            )


            # ------------------------------------------------
            # DESCOBRIR POSICAO DA MAO
            # ------------------------------------------------

            xs = [
                ponto.x
                for ponto in hand_landmarks.landmark
            ]

            ys = [
                ponto.y
                for ponto in hand_landmarks.landmark
            ]

            x = int(min(xs) * largura)
            y = int(min(ys) * altura)


            # ------------------------------------------------
            # MOSTRAR NUMERO DE DEDOS DA MAO
            # ------------------------------------------------

            cv2.putText(
                frame,
                f"{handedness}: {dedos} dedos",
                (x, max(y - 20, 30)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255, 0, 255),
                2
            )


    # ========================================================
    # TOTAL DE DEDOS
    # ========================================================

    cv2.rectangle(
        frame,
        (10, 10),
        (300, 75),
        (0, 0, 0),
        -1
    )

    cv2.putText(
        frame,
        f"DEDOS: {total_dedos}",
        (25, 55),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.2,
        (0, 255, 255),
        3
    )


    # ========================================================
    # FPS
    # ========================================================

    tempo_atual = time.time()

    fps = 1 / max(
        tempo_atual - tempo_anterior,
        0.0001
    )

    tempo_anterior = tempo_atual

    cv2.putText(
        frame,
        f"FPS: {fps:.1f}",
        (largura - 160, 35),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 255),
        2
    )


    # ========================================================
    # MOSTRAR TELA
    # ========================================================

    cv2.imshow(
        "Detector de Objetos + Dedos",
        frame
    )


    # ========================================================
    # SAIR COM Q OU ESC
    # ========================================================

    tecla = cv2.waitKey(1) & 0xFF

    if tecla == ord("q") or tecla == 27:
        break


# ============================================================
# FINALIZACAO
# ============================================================

camera.release()

hands.close()

cv2.destroyAllWindows()

print("Programa encerrado.")