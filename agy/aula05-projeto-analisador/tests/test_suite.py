"""
====================================================================
Suíte de Testes Automatizados - Analisador de Feedbacks Hamburgueria
Desenvolvido com: Google Antigravity & Pytest / Unittest
====================================================================
Validação rigorosa de todos os módulos da Camada 3 e rotas do Backend.
"""

import os
import sys
import unittest

# Adiciona o diretório raiz para permitir importações dos módulos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from execution.manage_data import (
    salvar_feedback,
    listar_feedbacks,
    atualizar_status_feedback,
    obter_metricas
)
from execution.send_alert import (
    disparar_alerta_gerente,
    construir_corpo_email_html
)
from execution.analyze_feedback import (
    _analise_deterministica_fallback,
    SENTIMENTOS_VALIDOS,
    TAGS_VALIDAS
)
from fastapi.testclient import TestClient
from backend.main import app


class TestAnalisadorFeedbacks(unittest.TestCase):

    def setUp(self):
        """Prepara o cliente de testes da API FastAPI."""
        self.client = TestClient(app)

    # -------------------------------------------------------------
    # 1. Testes da Camada de Dados (manage_data.py)
    # -------------------------------------------------------------
    def test_01_salvar_e_listar_feedback(self):
        novo = {
            "cliente_nome": "Teste Automatizado",
            "cliente_contato": "(14) 99999-1111",
            "nota_satisfacao": 5,
            "comentario": "Lanche maravilhoso e maionese perfeita!",
            "sentimento": "Positivo",
            "tags": ["Sabor"],
            "resumo": "Elogio ao lanche",
            "urgencia": False
        }
        salvo = salvar_feedback(novo)
        self.assertIsNotNone(salvo.get("id"))
        self.assertEqual(salvo["status"], "pendente")

        # Verifica se aparece na listagem
        lista = listar_feedbacks(sentimento="Positivo")
        ids = [item["id"] for item in lista]
        self.assertIn(salvo["id"], ids)

    def test_02_atualizar_status_tratativa(self):
        novo = {
            "cliente_nome": "Cliente Para Tratativa",
            "comentario": "Reclamação de teste",
            "sentimento": "Crítico",
            "tags": ["Atendimento"]
        }
        salvo = salvar_feedback(novo)
        fid = salvo["id"]

        # Atualiza para tratado
        atualizado = atualizar_status_feedback(fid, "tratado", "Resolvido com sucesso.")
        self.assertIsNotNone(atualizado)
        self.assertEqual(atualizado["status"], "tratado")
        self.assertEqual(atualizado["notas_gerente"], "Resolvido com sucesso.")
        self.assertIsNotNone(atualizado["tratado_em"])

    def test_03_metricas_consolidadas(self):
        metricas = obter_metricas()
        self.assertIn("total", metricas)
        self.assertIn("positivos", metricas)
        self.assertIn("criticos", metricas)
        self.assertIn("taxa_resolucao_pct", metricas)
        self.assertIn("tags", metricas)
        self.assertGreaterEqual(metricas["total"], 1)

    # -------------------------------------------------------------
    # 2. Testes da Camada de Alerta (send_alert.py)
    # ---------------------------------------------------    def test_04_template_email_html(self):
        fb_teste = {
            "cliente_nome": "Marcos Teste",
            "cliente_contato": "marcos@teste.com",
            "numero_pedido": "#8821",
            "nota_lanche": 1,
            "nota_entrega": 2,
            "nota_atendimento": 1,
            "comentario": "Lanche frio e murcho!",
            "resumo": "Problema com temperatura",
            "tags": ["Sabor", "Entrega"],
            "justificativa": "Falha de temperatura"
        }
        html = construir_corpo_email_html(fb_teste)
        self.assertIn("Alerta de Emergência", html)
        self.assertIn("Hamburgueria do Joselito", html)
        self.assertIn("Marcos Teste", html)
        self.assertIn("siteprofissional.pro", html)

    def test_05_disparo_alerta_contingencia(self):
        fb_teste = {
            "id": "fb_unit_test",
            "cliente_nome": "Ana Teste",
            "comentario": "Atraso inaceitável!",
            "sentimento": "Crítico",
            "tags": ["Entrega"],
            "resumo": "Atraso severo"
        }
        # Valida disparo real ou ativação resiliente de contingência sem quebrar a aplicação
        resultado = disparar_alerta_gerente(fb_teste)
        self.assertIn(resultado.get("modo"), ["smtp_real", "simulado_contingencia", "falha_contingencia"])
        self.assertEqual(resultado.get("destinatario"), "estudantebrasileiro777@gmail.com")

    # -------------------------------------------------------------
    # 3. Testes da Camada de Análise (analyze_feedback.py)
    # -------------------------------------------------------------
    def test_06_analise_heuristica_fallback(self):
        # Caso Crítico
        analise_critica = _analise_deterministica_fallback("O lanche chegou frio e muito queimado!")
        self.assertEqual(analise_critica["sentimento"], "Crítico")
        self.assertTrue(analise_critica["urgencia"])
        self.assertIn("Sabor", analise_critica["tags"])

        # Caso Positivo
        analise_pos = _analise_deterministica_fallback("Lanche incrível e atendimento nota 10!")
        self.assertEqual(analise_pos["sentimento"], "Positivo")
        self.assertFalse(analise_pos["urgencia"])
        self.assertIn("Atendimento", analise_pos["tags"])

    # -------------------------------------------------------------
    # 4. Testes dos Endpoints REST do Backend e Segurança OWASP
    # -------------------------------------------------------------
    def test_07_api_health(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        self.assertEqual(dados["status"], "online")

    def test_08_api_criar_feedback(self):
        # 1. Avaliação com notas altas 5 (Não é emergência -> Não dispara e-mail)
        payload_positivo = {
            "cliente_nome": "Roberto Carlos",
            "numero_pedido": "#1042",
            "cliente_contato": "(14) 98111-2222",
            "nota_lanche": 5,
            "nota_entrega": 5,
            "nota_atendimento": 5,
            "comentario": "Melhor burger artesanal de Ourinhos!"
        }
        resp1 = self.client.post("/api/feedbacks", json=payload_positivo)
        self.assertEqual(resp1.status_code, 201)
        dados1 = resp1.json()
        self.assertTrue(dados1["sucesso"])
        self.assertFalse(dados1.get("eh_emergencia", False))
        self.assertEqual(dados1["feedback"]["numero_pedido"], "#1042")

        # 2. Avaliação com nota baixa 1 ou 2 (Emergência -> Identificada para disparo)
        payload_emergencia = {
            "cliente_nome": "Cliente Muito Insatisfeito",
            "numero_pedido": "#1043",
            "cliente_contato": "(14) 99999-0001",
            "nota_lanche": 1,
            "nota_entrega": 2,
            "nota_atendimento": 1,
            "comentario": "Atraso inaceitável e comida fria!"
        }
        resp2 = self.client.post("/api/feedbacks", json=payload_emergencia)
        self.assertEqual(resp2.status_code, 201)
        dados2 = resp2.json()
        self.assertTrue(dados2["sucesso"])
        self.assertTrue(dados2["feedback"]["urgencia"])

    def test_09_acesso_nao_autorizado_owasp(self):
        """Verifica se rotas administrativas bloqueiam acesso sem autenticação (OWASP A01)."""
        resp_feedbacks = self.client.get("/api/feedbacks")
        self.assertEqual(resp_feedbacks.status_code, 401)

        resp_metrics = self.client.get("/api/metrics")
        self.assertEqual(resp_metrics.status_code, 401)

        resp_alert = self.client.post("/api/test-alert")
        self.assertEqual(resp_alert.status_code, 401)

    def test_10_login_e_fluxo_autenticado_gerente(self):
        """Testa login com credenciais válidas e inválidas, e acesso autorizado com token Bearer."""
        # 1. Tentativa com senha errada
        resp_errado = self.client.post("/api/auth/login", json={"usuario": "gerente", "senha": "errada"})
        self.assertEqual(resp_errado.status_code, 401)

        # 2. Login correto
        resp_ok = self.client.post("/api/auth/login", json={"usuario": "gerente", "senha": "gerente"})
        self.assertEqual(resp_ok.status_code, 200)
        dados_login = resp_ok.json()
        self.assertTrue(dados_login["sucesso"])
        self.assertIn("token", dados_login)
        token = dados_login["token"]

        headers = {"Authorization": f"Bearer {token}"}

        # 3. Acesso à listagem com token válido
        resp_feedbacks = self.client.get("/api/feedbacks?sentimento=Positivo", headers=headers)
        self.assertEqual(resp_feedbacks.status_code, 200)

        # 4. Acesso às métricas com token válido
        resp_metrics = self.client.get("/api/metrics", headers=headers)
        self.assertEqual(resp_metrics.status_code, 200)

        # 5. Logout e revogação de token
        resp_logout = self.client.post("/api/auth/logout", headers=headers)
        self.assertEqual(resp_logout.status_code, 200)

        # 6. Tentativa subsequente com token revogado deve retornar 401
        resp_revogado = self.client.get("/api/feedbacks", headers=headers)
        self.assertEqual(resp_revogado.status_code, 401)


if __name__ == "__main__":
    unittest.main()

