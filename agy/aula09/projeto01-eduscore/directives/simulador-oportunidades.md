# Especificação Técnica do Módulo: Simulador SISU, ProUni e FIES

> **Documento:** Diretiva de Engenharia do Simulador de Acesso Universitário  
> **Classificação:** Camada 1 (Estratégia & Especificação Canônica)  
> **Perfil:** Padrão SENAI - Alta Performance & Alinhamento de Oportunidades Educacionais  
> **Versão:** 1.0

---

## 1. Visão Geral e Propósito

O **Simulador de Oportunidades Universitárias** conecta os resultados obtidos nos Microdados do ENEM 2025 com as chances reais de ingresso no Ensino Superior através dos três principais programas governamentais brasileiros:
1. **SISU (Sistema de Seleção Unificada):** Vagas em instituições públicas (federais e estaduais).
2. **ProUni (Programa Universidade para Todos):** Bolsas de estudo integrais (100%) e parciais (50%) em instituições privadas.
3. **FIES (Fundo de Financiamento Estudantil):** Financiamento a juros baixos ou zero para cursos superiores em instituições privadas.

O usuário escolhe uma localidade (ex: cidade de **Birigui - SP**), o sistema carrega automaticamente a média da escola #1 da cidade (ou média local), e permite ajustar a nota para simular em quais faculdades, cidades e cursos aquela pontuação garante aprovação no estado de SP e no Brasil.

---

## 2. Regras de Negócio e Requisitos dos Programas

### 2.1. SISU
* **Instituições:** Universidades Federais, Universidades Estaduais e Institutos Federais (ex: IFSP, UNESP, USP, UNICAMP, UFSCAR, etc.).
* **Critério:** Seleção estrita pela nota do ENEM sem requisito prévio de renda.
* **Notas de corte típicas:** Variam de ~550 (Licenciaturas) a ~815 (Medicina).

### 2.2. ProUni
* **Instituições:** Universidades, Centros Universitários e Faculdades Privadas (ex: UniToledo, Unisalesiano, Mackenzie, PUC, etc.).
* **Critério de Elegibilidade Mínimo:** Mínimo de **450 pontos** de média nas provas objetivas e **nota maior que zero na redação**.
* **Modalidades de Bolsa:**
  * **Bolsa Integral (100%):** Renda familiar bruta per capita de até 1,5 salário mínimo.
  * **Bolsa Parcial (50%):** Renda familiar bruta per capita de até 3 salários mínimos.
* **Notas de corte típicas:** ~520 a ~770 pontos.

### 2.3. FIES
* **Instituições:** Faculdades Privadas com adesão ao fundo de financiamento.
* **Critério de Elegibilidade Mínimo:** Mínimo de **450 pontos** de média nas provas e **redação maior que zero**.
* **Notas de corte típicas:** ~480 a ~750 pontos.

---

## 3. Arquitetura da Solução

### 3.1. Camada de Dados & Backend
* **Base Canônica de Ofertas e Cortes:** Tabela `oportunidades_ensino_superior` no DuckDB / dataset modelado com cursos, faculdades, municípios, coordenadas de latitude/longitude e notas de corte históricas reais.
* **Endpoint da API:**
  `GET /api/simulador/oportunidades`
  * Parâmetros: `programa`, `nota`, `uf`, `municipio`, `abrangencia`, `curso`, `turno`.
  * Retorno: Elegibilidade, total de vagas aprovadas, lista de cidades mapeadas com coordenadas geográficas e catálogo de cursos aprovados.

### 3.2. Camada de Frontend
* **Controles Interativos:**
  * Seletor de Programa: `[🏛️ SISU (Pública) | 🎓 ProUni (Bolsas 100%/50%) | 💳 FIES (Financiamento)]`
  * Slider & Input Numérico da Nota (conectado à melhor escola da cidade selecionada).
  * Filtro de Abrangência: `[📍 Estado Atual (ex: SP) | 🇧🇷 Todo o Brasil]`
  * Campo de busca por Curso (ex: Direito, Medicina, Enfermagem, etc.).
* **Visualização Híbrida:**
  * Aba **Mapa Interativo (SVG Responsivo):** Mapeia os municípios e faculdades com status de aprovação.
  * Aba **Lista Completa de Oportunidades:** Cards com cálculo de margem (`+XX pts acima da nota de corte`).
