# Guia de UI/UX e Design System: EduScore

> **Documento:** Especificação Visual, Design System e Arquitetura de Interface (SDD)  
> **Classificação:** Camada 1 (Diretiva de Design Canônica)  
> **Perfil:** Padrão SENAI - Clean Data Intelligence & Mobile-First  
> **Versão:** 2.0 (Consolidada com Todas as Zonas Visuais e Dashboards)

---

## 1. Filosofia Visual e Diretrizes Gerais

O **EduScore** foi concebido para transmitir clareza analítica, velocidade e sofisticação institucional. Como a plataforma processa um dos maiores bancos de dados educacionais do mundo (+4,81 milhões de registros do ENEM), a interface deve equilibrar densidade informacional com leveza estética.

* **Conceito:** *Clean Data Intelligence* (inspirado na precisão visual de ferramentas de alta fidelidade como Linear, Vercel Analytics e Stripe Dashboard).
* **Tema:** Exclusivamente **Light Mode Moderno** (fundos neutros em ardósia suave, tipografia de alto contraste, elevações sutis e paleta intencional em azul cobalto e verde esmeralda).
* **Abordagem:** **Mobile-First** estrito. Toda a estrutura é desenhada primeiro para viewport de `375px` (empilhamento vertical inteligente, botões com área de toque mínima de `44x44px`) e expande-se organicamente para resoluções Desktop (`1280px+`).
* **Arquitetura de Tela:** **Single-Page Workspace** (Interface Única). Elimina telas soltas e modais desconexos; a navegação ocorre por reatividade instantânea, barras fixas, expansões inline (*accordions*) e painel lateral deslizante (*slide-over drawer*).

---

## 2. Paleta de Cores e Design Tokens (Tailwind CSS v4)

### 2.1. Cores de Superfície e Estrutura
* **Background Global:** `#F8FAFC` (`slate-50`) — tom acinzentado frio que previne a fadiga ocular do branco puro.
* **Superfície de Cards e Containers:** `#FFFFFF` (`white`) com contorno refinado `#E2E8F0` (`slate-200`) e sombra suave `shadow-xs hover:shadow-sm`.
* **Texto Primário (Títulos, Nomes de Escolas, Notas):** `#0F172A` (`slate-900`) — contraste visual máximo.
* **Texto Secundário (Labels, Códigos INEP, Contadores):** `#64748B` (`slate-500`).
* **Bordas e Divisórias:** `#F1F5F9` (`slate-100`) a `#E2E8F0` (`slate-200`).

### 2.2. Acentos de Marca e Identidade Analítica
* **Cor Primária Nacional / Ações:** `#2563EB` (`blue-600`) com fundos suaves `#EFF6FF` (`blue-50`). Representa a métrica benchmark do Brasil.
* **Cor Secundária do Filtro Local:** `#059669` (`emerald-600`) com fundos suaves `#ECFDF5` (`emerald-50`). Representa a localidade ou recorte selecionado.
* **Indicadores Semânticos de Diferencial de Notas:**
  * **Acima do Benchmark:** `#059669` (`emerald-600`) — pill com ícone `▲ +X.X pts`.
  * **Abaixo do Benchmark:** `#E11D48` (`rose-600`) — pill com ícone `▼ -X.X pts`.
  * **Neutro / Em Linha:** `#64748B` (`slate-500`).
* **Badge Institucional de Sigilo Estatístico INEP:**
  * `#6366F1` (`indigo-600`) com fundo `#EEF2FF` (`indigo-50`) e borda `#C7D2FE` (`indigo-200`). Ícone: `Lock`.

### 2.3. Tipografia e Formatação Numérica
* **Família Tipográfica:** `Inter` ou `Plus Jakarta Sans` para textos de interface, rótulos e cabeçalhos.
* **Formatação Numérica Mandatória:**
  * Uso de `font-variant-numeric: tabular-nums` em todas as notas e contadores para evitar oscilações visuais ("pulos" de largura) durante transições de dados.
  * **Arredondamento Estrito:** Todas as notas devem ser exibidas obrigatoriamente com **1 casa decimal** (ex: `642.5` e nunca `642.53333333333`), mantendo a estabilidade espacial dos componentes.

---

## 3. Anatomia da Interface Única (Layout Vertical em 5 Zonas)

A interface única do EduScore é organizada em **5 zonas verticais consecutivas**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ ZONA 1: Header & Telemetria Massiva (+4.81M Censo / 3.47M Avaliados)   │
├────────────────────────────────────────────────────────────────────────┤
│ ZONA 2: Barra Sticky de Filtros em Cascata (com Persistência Local)    │
├────────────────────────────────────────────────────────────────────────┤
│ ZONA 3: Cards de Benchmark Comparativo Rápido (Brasil vs. Filtro)      │
├────────────────────────────────────────────────────────────────────────┤
│ ZONA 4: Dashboard Analítico Visual de Alto Impacto                     │
│  - 4.1: Donut Charts SVG (Presença vs Abstenção: Brasil & Filtro)      │
│  - 4.2: Side-by-Side Clustered Columns (Brasil vs Filtro por Matéria)  │
│  - 4.3: Top 10 Rankings com Explosão por Matéria e Drill-Down Inline   │
├────────────────────────────────────────────────────────────────────────┤
│ ZONA 5: Explorador de Escolas e Alunos (Grid + Drawer Lateral Completo)│
└────────────────────────────────────────────────────────────────────────┘
```

---

### Zona 1: Header de Telemetria e Ingestão de Censo (Topo)
* **Objetivo:** Estabelecer credibilidade e transparência analítica imediata sobre o volume de microdados processados.
* **Componentes:**
  1. **Logo EduScore:** Identidade visual moderna com gradiente azul índigo e selo de tecnologia *Antigravity AI*.
  2. **Contadores de Transparência Estatística:**
     * **Censo Total:** `4.810.772 inscritos no CSV bruto`.
     * **Participantes Avaliados:** `3.473.543 alunos indexados com notas válidas`.
  3. **Pills de Arquivos Auditados:**
     * `[CSV] MICRODADOS_ENEM_2025.csv (4.81M)`
     * `[XLSX] Dicionário Oficial INEP (Carregado)`
     * `[INPUT] Script de Tipagem R/SAS (Aplicado)`
  4. **Status do Motor DuckDB:** Badge pulsante verde `100% Base Pronta para Consulta Instantânea`.

---

### Zona 2: Barra de Filtros Geográficos em Cascata (Sticky Bar)
* Fixa no topo ao rolar a página (`sticky top-0 z-20 backdrop-blur-md bg-white/95 border-b border-slate-200/80`).
* **Hierarquia dos Seletores:**
  `Região` ➔ `Estado (UF)` ➔ `Município` ➔ `Rede de Ensino (Todas, Privada, Pública, Federal, Estadual, Municipal)`.
* **Persistência de Estado Automática:** O estado dos filtros é armazenado no `localStorage` do navegador sob a chave `eduscore_filters_v2`, permitindo que o usuário recarregue a página (`F5`) sem perder sua seleção geográfica.
* **Ação Rápida:** Botão `Limpar Filtros` para retornar instantaneamente ao benchmark nacional consolidado.

---

### Zona 3: Painel Comparativo de Benchmarks Rápidos (Cards de Desempenho)
Dispostos lado a lado em Desktop (`grid grid-cols-1 lg:grid-cols-2 gap-6`):
1. **Card da Esquerda — Referência Nacional (Brasil):**
   * Título com bandeira do Brasil e média geral nacional em destaque tipográfico (`text-4xl font-extrabold text-blue-600`).
   * Mini-grid com as 5 áreas com labels oficiais:
     * `Natureza (CN)` | `Humanas (CH)` | `Linguagens (LC)` | `Matemática (MT)` | `Redação`
2. **Card da Direita — Resultado do Filtro Selecionado:**
   * Título contextual (ex.: *"Resultado: Sudeste > São Paulo > Ourinhos"*).
   * Média geral do filtro (`text-4xl font-extrabold text-emerald-600`) acompanhada do badge comparativo percentual contra o Brasil.
   * Mini-grid com as 5 matérias exibindo o diferencial individual de pontos e cores semânticas.

---

### Zona 4: Dashboard Analítico Visual de Alto Impacto
Esta seção substitui menus complexos ou botões isolados de RAG, entregando inteligência gráfica direta na tela:

#### 4.1. Donut Charts SVG (Presença vs. Abstenção)
* Dois gráficos de rosca lado a lado renderizados com SVG responsivo puro (zero dependência de bibliotecas externas pesadas):
  * **Donut 1:** Taxa de Avaliados vs. Abstenção no **Brasil** (63.3% presentes / 36.7% abstenções).
  * **Donut 2:** Taxa de Avaliados vs. Abstenção no **Filtro Selecionado**.
* Legenda clara com quantidades absolutas e percentuais com animação sutil de entrada.

#### 4.2. Gráfico de Colunas Agrupadas Lado a Lado (Side-by-Side Clustered Columns)
* Posicionado logo abaixo dos donuts, compara verticalmente o desempenho do Brasil com o Filtro em 6 dimensões:
  1. **Média Geral**
  2. **Ciências da Natureza (CN)**
  3. **Ciências Humanas (CH)**
  4. **Linguagens e Códigos (LC)**
  5. **Matemática (MT)**
  6. **Redação**
* **Estilização das Colunas:**
  * **Coluna 1 (Brasil):** Gradiente índigo/azul escuro (`from-blue-700 to-indigo-500`) com pontuação exata no topo.
  * **Coluna 2 (Filtro):** Gradiente esmeralda/verde azulado (`from-emerald-600 to-teal-400`) com pontuação exata no topo.
  * **Pill Comparativo Flutuante:** No topo de cada par de colunas, indica se o filtro está acima (`▲ +14.2 pts`) ou abaixo (`▼ -8.5 pts`) da média do país.
  * **Eixo Y Canônico do ENEM:** Escala graduada de 0 a 1000 pontos com linhas de grade elegantes.
  * **Cards de Síntese no Rodapé:** Resumo executivo destacando as médias gerais e o diferencial líquido consolidado.

#### 4.3. Rankings Top 10 Escolas com Explosão Interativa e Drill-Down
* **Dois Rankings Paralelos:** Top 10 Melhores Escolas do Brasil versus Top 10 Melhores Escolas do Filtro Selecionado.
* **Barra de Explosão por Matéria:** Botões seletores em tempo real que permitem ao usuário reorganizar os dois rankings instantaneamente por:
  `Média Geral` | `Natureza (CN)` | `Humanas (CH)` | `Linguagens (LC)` | `Matemática (MT)` | `Redação`.
* **Explosão por Escola (Drill-Down Inline):** Cada item do ranking possui um botão retrátil que expande um mini-card revelando as 5 notas daquela instituição sem sair da página e um atalho para abrir o Drawer de detalhes completos.

---

### Zona 5: Explorador de Escolas e Alunos (Master-Detail)

#### 5.1. Grid de Escolas
* Cabeçalho com busca por texto, filtro de ordenação e contador de instituições encontradas.
* **Identificação Nobre da Escola:**
  * **Nome Oficial em Destaque:** 100% hidratado desde o primeiro carregamento (ex: `Colégio e Curso Motiva`, `Colégio Objetivo`, etc.).
  * **Tratamento de Sigilo:** Instituições com turmas reduzidas (<10 avaliados) exibem o badge `🔒 Sigilo INEP` com explicação sobre salvaguarda estatística da LGPD e nome institucional digno (sem códigos no nome).
  * Código INEP em badge discreto (`#25012345`) e pill da rede (`Particular`, `Estadual`, `Federal`).
  * Total de alunos avaliados e Média Geral com tag de cor correspondente à faixa de nota.

#### 5.2. Slide-Over Drawer de Detalhes da Escola e Estudantes
Ao clicar em qualquer escola, desliza suavemente um painel lateral a partir da direita (Desktop) ou sobe como Bottom Sheet (Mobile):
1. **Cabeçalho Cadastral:**
   * Nome Oficial Completo da Escola.
   * Endereço físico completo com ícone `MapPin`.
   * Telefone de contato formatado com ícone `Phone` (link `tel:` clicável em smartphones).
   * Alerta informativo sobre Sigilo INEP caso a escola esteja sob proteção estatística.
2. **Boletim Consolidado da Escola:**
   * Cards com as médias da instituição nas 5 matérias e a Média Geral destacada.
3. **Lista de Estudantes Humanizados:**
   * **Nomes Brasileiros Determinísticos:** Exibe nomes realistas gerados a partir do hash da inscrição e gênero (ex: "Gabriel Santos Silva", "Mariana Oliveira Costa").
   * **Badge Secundário de Inscrição:** `Inscrição #25000XXXXXX`.
   * **Boletim Individual do Aluno:** Expansão em accordion com as 5 notas daquele participante devidamente arredondadas a 1 casa decimal.

---

## 4. Diretrizes de Performance e Acessibilidade

1. **Responsividade Estrita:**
   * Em telas menores que `640px`, os rankings e as colunas adaptam suas larguras e textos de forma fluida. O drawer ocupa 100% da tela mobile.
2. **Prevenção de FADIGA Visual e Quebra de Layout:**
   * Arredondamento estrito em 1 decimal em todas as notas.
   * Tooltips nativos e contraste WCAG AA em todos os textos e badges.
3. **Persistência e Confiabilidade:**
   * Transições suaves com CSS transitions (`duration-200`).
   * Zero modais intrusivos que bloqueiem a navegação.