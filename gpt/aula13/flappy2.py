import pygame
import random
import sys

pygame.init()

# Janela
LARGURA = 500
ALTURA = 700

tela = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption("Flappy Bird Fácil")

relogio = pygame.time.Clock()

# Cores
AZUL = (120, 200, 255)
VERDE = (40, 180, 70)
AMARELO = (255, 220, 0)
BRANCO = (255, 255, 255)
PRETO = (0, 0, 0)

# Fonte
fonte = pygame.font.SysFont("arial", 40, bold=True)
fonte_pequena = pygame.font.SysFont("arial", 22)

# Pássaro
passaro_x = 100
passaro_y = 350

tamanho_passaro = 30

velocidade_y = 0

# Mais fácil:
gravidade = 0.30
pulo = -6.5

# Canos
largura_cano = 70

# Abertura bem maior
espaco_cano = 260

# Canos mais lentos
velocidade_cano = 2.5

distancia_canos = 330

pontos = 0
game_over = False


def criar_cano(x):

    altura = random.randint(
        100,
        ALTURA - espaco_cano - 100
    )

    return {
        "x": x,
        "altura": altura,
        "passou": False
    }


canos = [
    criar_cano(600),
    criar_cano(930),
    criar_cano(1260)
]


def desenhar_passaro():

    pygame.draw.circle(
        tela,
        AMARELO,
        (int(passaro_x), int(passaro_y)),
        tamanho_passaro // 2
    )

    # Olho
    pygame.draw.circle(
        tela,
        BRANCO,
        (int(passaro_x + 6), int(passaro_y - 5)),
        5
    )

    pygame.draw.circle(
        tela,
        PRETO,
        (int(passaro_x + 7), int(passaro_y - 5)),
        2
    )


def desenhar_cano(cano):

    x = cano["x"]
    altura = cano["altura"]

    # Cano de cima
    pygame.draw.rect(
        tela,
        VERDE,
        (
            x,
            0,
            largura_cano,
            altura
        )
    )

    # Cano de baixo
    inicio_baixo = altura + espaco_cano

    pygame.draw.rect(
        tela,
        VERDE,
        (
            x,
            inicio_baixo,
            largura_cano,
            ALTURA - inicio_baixo
        )
    )


def verificar_colisao(cano):

    passaro = pygame.Rect(
        passaro_x - 12,
        passaro_y - 12,
        24,
        24
    )

    cano_cima = pygame.Rect(
        cano["x"],
        0,
        largura_cano,
        cano["altura"]
    )

    inicio_baixo = cano["altura"] + espaco_cano

    cano_baixo = pygame.Rect(
        cano["x"],
        inicio_baixo,
        largura_cano,
        ALTURA - inicio_baixo
    )

    return (
        passaro.colliderect(cano_cima)
        or
        passaro.colliderect(cano_baixo)
    )


def reiniciar():

    global passaro_y
    global velocidade_y
    global pontos
    global game_over
    global canos

    passaro_y = 350
    velocidade_y = 0
    pontos = 0
    game_over = False

    canos = [
        criar_cano(600),
        criar_cano(930),
        criar_cano(1260)
    ]


while True:

    # Eventos
    for evento in pygame.event.get():

        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if evento.type == pygame.KEYDOWN:

            if evento.key == pygame.K_SPACE:

                if game_over:
                    reiniciar()
                else:
                    velocidade_y = pulo

            if evento.key == pygame.K_ESCAPE:
                pygame.quit()
                sys.exit()


    if not game_over:

        # Física do pássaro
        velocidade_y += gravidade
        passaro_y += velocidade_y

        # Movimento dos canos
        for cano in canos:

            cano["x"] -= velocidade_cano

            # Pontuação
            if (
                cano["x"] + largura_cano < passaro_x
                and not cano["passou"]
            ):

                cano["passou"] = True
                pontos += 1

            # Colisão
            if verificar_colisao(cano):
                game_over = True


        # Criar novos canos
        if canos[0]["x"] < -largura_cano:

            canos.pop(0)

            novo_x = canos[-1]["x"] + distancia_canos

            canos.append(
                criar_cano(novo_x)
            )


        # Topo e chão
        if passaro_y < 0:
            passaro_y = 0
            velocidade_y = 0

        if passaro_y > ALTURA:
            game_over = True


    # Fundo
    tela.fill(AZUL)

    # Canos
    for cano in canos:
        desenhar_cano(cano)

    # Pássaro
    desenhar_passaro()

    # Pontos
    texto = fonte.render(
        str(pontos),
        True,
        BRANCO
    )

    tela.blit(
        texto,
        (
            LARGURA // 2 - texto.get_width() // 2,
            30
        )
    )


    if game_over:

        texto_game_over = fonte.render(
            "GAME OVER",
            True,
            BRANCO
        )

        tela.blit(
            texto_game_over,
            (
                LARGURA // 2 - texto_game_over.get_width() // 2,
                300
            )
        )

        texto_reiniciar = fonte_pequena.render(
            "Aperte ESPAÇO para tentar novamente",
            True,
            BRANCO
        )

        tela.blit(
            texto_reiniciar,
            (
                LARGURA // 2 - texto_reiniciar.get_width() // 2,
                360
            )
        )


    pygame.display.update()

    relogio.tick(60)