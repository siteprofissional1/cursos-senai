# Arquitetura Pedagógica e Algoritmos de Manipulação - Joselito Bet

**Instituição:** SENAI  
**Projeto:** Joselito Bet (Simulador Educacional de Probabilidade e Manipulação de Cassinos Online)  
**Objetivo Pedagógico:** Demonstrar empiricamente por que casas de apostas online não são investimentos e como seus algoritmos exploram fraquezas cognitivas humanas e desequilíbrios matemáticos.

---

## 1. Princípios Matemáticos das Casas de Aposta

### 1.1 A Lei dos Grandes Números
Em curto prazo, qualquer apostador pode ter uma "sorte esporádica". No entanto, a Lei dos Grandes Números dita que conforme o número de rodadas tende ao infinito, o resultado real do jogador converge rigorosamente para o valor esperado ($E[X]$) pré-programado pela banca, que é invariavelmente negativo.

### 1.2 Retorno Teórico ao Jogador (RTP) e Margem da Casa (House Edge)
- **Jogos Tradicionais Justos:** Possuem RTP de 95% a 98% (a casa retém 2% a 5% por rodada).
- **Apostas Digitais Não Regulamentadas:** Possuem RTPs manipulados arbitrariamente, muitas vezes inferiores a 20% a 50%.

---

## 2. Anatomia dos 4 Algoritmos do Joselito Bet

### 2.1 Jogo 1: Sorteio de 1 a 10
* **Promessa Comercial:** *"Se acertar o número, você ganha 5x o valor apostado!"*
* **Ilusão:** O jogador acredita ter 10% de chance teórica, mas o prêmio justo para 10 possibilidades seria de 10x. Pagando apenas 5x, o jogador já perde 50% matematicamente no longo prazo:
  $$E[X] = (0.10 \times 5) - 1 = -0.50 \text{ (-50\% por aposta)}$$
* **Manipulação Ativa:** O algoritmo monitora o número escolhido pelo aluno e, em 90% das rodadas, elimina o número escolhido do conjunto de sorteio aleatório, garantindo a derrota.

### 2.2 Jogo 2: Aviãozinho Crash
* **Promessa Comercial:** *"O multiplicador sobe infinitamente, basta você sacar antes de cair!"*
* **Gatilho Psicológico:** Ganância e aversão à perda.
* **Manipulação Ativa:**
  1. A casa calcula o ponto de colisão antes da decolagem.
  2. Em 80% das rodadas, o avião cai antes de 1.40x.
  3. Se o aluno apostar um valor alto (> R$ 25), o algoritmo aplica a rotina `isHighBet`, derrubando o avião quase imediatamente (entre 1.02x e 1.22x), impedindo que o jogador lucre em apostas de alto valor.

### 2.3 Jogo 3: Roleta Viciada
* **Promessa Comercial:** *"50% de chance no Vermelho ou Preto com retorno de 2.00x!"*
* **Fator Real:** A existência do número 0 (Verde) quebra a simetria de 50/50.
* **Manipulação Ativa:** O script detecta a cor apostada e programa a desaceleração para parar em uma casa da cor oposta em 85% das tentativas, além de direcionar para o zero verde.

### 2.4 Jogo 4: Fortune Tigrinho (Slots 3x3)
* **Gatilho Psicológico:** **Near-Miss Effect (Efeito do "Quase Ganhou")**.
* **Manipulação Ativa:**
  - A psicologia comportamental comprova que o cérebro humano reage a um "quase ganhei" de forma quase idêntica a uma vitória real, liberando dopamina.
  - O algoritmo fixa os símbolos da primeira e segunda colunas com o Tigrinho (maior prêmio) e desacelera dramaticamente a terceira coluna com animação de tensão, parando propositalmente 1 posição fora da linha de pagamento central.

---

## 3. Conclusão Pedagógica
Ao inspecionar o código-fonte em JavaScript dos 4 jogos, os estudantes do SENAI compreendem que **não existe estratégia, padrão de horário ("minutos pagantes") ou inteligência humana** capaz de vencer um código proprietário fechado rodando no servidor de uma casa de apostas.
