import pygame
import random
import sys

# --------------------------------------------------
# INICIALIZAÇÃO
# --------------------------------------------------

pygame.init()

LARGURA = 500
ALTURA = 700

TELA = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption("Flappy Python")

RELOGIO = pygame.time.Clock()

FPS = 60


# --------------------------------------------------
# CORES
# --------------------------------------------------

AZUL_CEU = (135, 206, 235)
VERDE = (34, 177, 76)
VERDE_ESCURO = (20, 120, 50)
AMARELO = (255, 220, 0)
BRANCO = (255, 255, 255)
PRETO = (20, 20, 20)
VERMELHO = (220, 40, 40)


# --------------------------------------------------
# FONTES
# --------------------------------------------------

FONTE_GRANDE = pygame.font.SysFont("arial", 48, bold=True)
FONTE_MEDIA = pygame.font.SysFont("arial", 28, bold=True)
FONTE_PEQUENA = pygame.font.SysFont("arial", 20)


# --------------------------------------------------
# CONFIGURAÇÕES DO PÁSSARO
# --------------------------------------------------

PASSARO_X = 100
PASSARO_TAMANHO = 35

gravidade = 0.5
forca_pulo = -9


# --------------------------------------------------
# CONFIGURAÇÕES DOS CANOS
# --------------------------------------------------

LARGURA_CANO = 80
ESPACO_CANO = 190
VELOCIDADE_CANO = 4

DISTANCIA_ENTRE_CANOS = 280


# --------------------------------------------------
# FUNÇÕES
# --------------------------------------------------

def criar_cano(x):
    """
    Cria um novo par de canos.
    """

    altura_superior = random.randint(100, ALTURA - ESPACO_CANO - 150)

    return {
        "x": x,
        "altura_superior": altura_superior,
        "passou": False
    }


def desenhar_passaro(x, y):
    """
    Desenha o personagem.
    """

    # Corpo
    pygame.draw.circle(
        TELA,
        AMARELO,
        (int(x), int(y)),
        PASSARO_TAMANHO // 2
    )

    # Asa
    pygame.draw.ellipse(
        TELA,
        (255, 180, 0),
        (
            int(x - 15),
            int(y),
            22,
            12
        )
    )

    # Olho
    pygame.draw.circle(
        TELA,
        BRANCO,
        (int(x + 8), int(y - 7)),
        7
    )

    pygame.draw.circle(
        TELA,
        PRETO,
        (int(x + 10), int(y - 7)),
        3
    )

    # Bico
    pygame.draw.polygon(
        TELA,
        (255, 100, 0),
        [
            (x + 17, y - 2),
            (x + 30, y + 3),
            (x + 17, y + 8)
        ]
    )


def desenhar_cano(cano):
    """
    Desenha o cano superior e inferior.
    """

    x = cano["x"]
    altura_superior = cano["altura_superior"]

    # Cano superior
    pygame.draw.rect(
        TELA,
        VERDE,
        (
            x,
            0,
            LARGURA_CANO,
            altura_superior
        )
    )

    # Borda do cano superior
    pygame.draw.rect(
        TELA,
        VERDE_ESCURO,
        (
            x,
            0,
            LARGURA_CANO,
            altura_superior
        ),
        4
    )

    # Cano inferior
    inicio_inferior = altura_superior + ESPACO_CANO

    pygame.draw.rect(
        TELA,
        VERDE,
        (
            x,
            inicio_inferior,
            LARGURA_CANO,
            ALTURA - inicio_inferior
        )
    )

    pygame.draw.rect(
        TELA,
        VERDE_ESCURO,
        (
            x,
            inicio_inferior,
            LARGURA_CANO,
            ALTURA - inicio_inferior
        ),
        4
    )


def colisao_passaro_cano(passaro_y, cano):
    """
    Verifica se o pássaro bateu nos canos.
    """

    passaro_rect = pygame.Rect(
        PASSARO_X - PASSARO_TAMANHO // 2,
        passaro_y - PASSARO_TAMANHO // 2,
        PASSARO_TAMANHO,
        PASSARO_TAMANHO
    )

    x = cano["x"]
    altura_superior = cano["altura_superior"]

    cano_superior = pygame.Rect(
        x,
        0,
        LARGURA_CANO,
        altura_superior
    )

    inicio_inferior = altura_superior + ESPACO_CANO

    cano_inferior = pygame.Rect(
        x,
        inicio_inferior,
        LARGURA_CANO,
        ALTURA - inicio_inferior
    )

    return (
        passaro_rect.colliderect(cano_superior)
        or
        passaro_rect.colliderect(cano_inferior)
    )


def desenhar_texto(texto, fonte, cor, x, y, centralizado=True):

    superficie = fonte.render(texto, True, cor)

    rect = superficie.get_rect()

    if centralizado:
        rect.center = (x, y)
    else:
        rect.topleft = (x, y)

    TELA.blit(superficie, rect)


def tela_game_over(pontos):

    desenhar_texto(
        "GAME OVER",
        FONTE_GRANDE,
        VERMELHO,
        LARGURA // 2,
        ALTURA // 2 - 80
    )

    desenhar_texto(
        f"Pontuação: {pontos}",
        FONTE_MEDIA,
        BRANCO,
        LARGURA // 2,
        ALTURA // 2
    )

    desenhar_texto(
        "ESPAÇO para jogar novamente",
        FONTE_PEQUENA,
        BRANCO,
        LARGURA // 2,
        ALTURA // 2 + 60
    )


# --------------------------------------------------
# LOOP PRINCIPAL
# --------------------------------------------------

def jogo():

    passaro_y = ALTURA // 2

    velocidade_y = 0

    pontos = 0

    game_over = False

    canos = [
        criar_cano(LARGURA + 100),
        criar_cano(LARGURA + 100 + DISTANCIA_ENTRE_CANOS),
        criar_cano(LARGURA + 100 + DISTANCIA_ENTRE_CANOS * 2)
    ]

    while True:

        # ------------------------------------------
        # EVENTOS
        # ------------------------------------------

        for evento in pygame.event.get():

            if evento.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if evento.type == pygame.KEYDOWN:

                if evento.key == pygame.K_SPACE:

                    if game_over:

                        return jogo()

                    else:

                        velocidade_y = forca_pulo

                if evento.key == pygame.K_ESCAPE:

                    pygame.quit()
                    sys.exit()


        # ------------------------------------------
        # ATUALIZAÇÃO DO JOGO
        # ------------------------------------------

        if not game_over:

            # Gravidade

            velocidade_y += gravidade

            passaro_y += velocidade_y


            # Movimentação dos canos

            for cano in canos:

                cano["x"] -= VELOCIDADE_CANO


                # Pontuação

                if (
                    cano["x"] + LARGURA_CANO < PASSARO_X
                    and
                    not cano["passou"]
                ):

                    cano["passou"] = True
                    pontos += 1


                # Colisão

                if colisao_passaro_cano(passaro_y, cano):

                    game_over = True


            # Remove cano que saiu da tela

            if canos[0]["x"] < -LARGURA_CANO:

                canos.pop(0)

                novo_x = canos[-1]["x"] + DISTANCIA_ENTRE_CANOS

                canos.append(
                    criar_cano(novo_x)
                )


            # Colisão com topo e chão

            if passaro_y < 0:

                game_over = True

            if passaro_y > ALTURA:

                game_over = True


        # ------------------------------------------
        # DESENHO
        # ------------------------------------------

        TELA.fill(AZUL_CEU)


        # Nuvens decorativas

        pygame.draw.circle(
            TELA,
            BRANCO,
            (80, 100),
            30
        )

        pygame.draw.circle(
            TELA,
            BRANCO,
            (110, 100),
            40
        )

        pygame.draw.circle(
            TELA,
            BRANCO,
            (140, 100),
            25
        )


        # Canos

        for cano in canos:

            desenhar_cano(cano)


        # Pássaro

        desenhar_passaro(
            PASSARO_X,
            passaro_y
        )


        # Pontuação

        desenhar_texto(
            str(pontos),
            FONTE_GRANDE,
            BRANCO,
            LARGURA // 2,
            60
        )


        # Game over

        if game_over:

            tela_game_over(pontos)


        pygame.display.update()

        RELOGIO.tick(FPS)


# --------------------------------------------------
# EXECUÇÃO
# --------------------------------------------------

jogo()