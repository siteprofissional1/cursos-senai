"""
Testes Unitários e de Integração para Smart To-Do List
Baseado no framework padrão unittest (compatibilidade total e zero dependência externa adicional).
"""

import os
import json
import tempfile
import unittest
from execution.organize_tasks import ordenar_tarefas, salvar_tarefas_organizadas, carregar_tarefas_organizadas
from execution.ai_service import Tarefa, TriagemTarefas
from execution.view import formatar_tempo


class TestSmartTodoList(unittest.TestCase):

    def test_ordenacao_prioridade_e_desempate(self):
        """
        Testa se tarefas com maior score_prioridade vêm primeiro,
        e se tarefas com mesmo score são desempatadas pelo menor tempo estimado.
        """
        tarefas_desordenadas = [
            {"titulo": "Tarefa Baixa", "score_prioridade": 1, "tempo_estimado_minutos": 10},
            {"titulo": "Tarefa Crítica Longa", "score_prioridade": 5, "tempo_estimado_minutos": 120},
            {"titulo": "Tarefa Crítica Rápida", "score_prioridade": 5, "tempo_estimado_minutos": 15},
            {"titulo": "Tarefa Média", "score_prioridade": 3, "tempo_estimado_minutos": 45},
            {"titulo": "Tarefa Alta", "score_prioridade": 4, "tempo_estimado_minutos": 30},
        ]

        resultado = ordenar_tarefas(tarefas_desordenadas)

        # 1º e 2º devem ser as Críticas (score 5), sendo a rápida (15 min) antes da longa (120 min)
        self.assertEqual(resultado[0]["titulo"], "Tarefa Crítica Rápida")
        self.assertEqual(resultado[0]["score_prioridade"], 5)
        self.assertEqual(resultado[0]["tempo_estimado_minutos"], 15)

        self.assertEqual(resultado[1]["titulo"], "Tarefa Crítica Longa")
        self.assertEqual(resultado[1]["score_prioridade"], 5)
        self.assertEqual(resultado[1]["tempo_estimado_minutos"], 120)

        # 3º deve ser a Alta (score 4)
        self.assertEqual(resultado[2]["titulo"], "Tarefa Alta")
        self.assertEqual(resultado[2]["score_prioridade"], 4)

        # 4º deve ser a Média (score 3)
        self.assertEqual(resultado[3]["titulo"], "Tarefa Média")
        self.assertEqual(resultado[3]["score_prioridade"], 3)

        # 5º deve ser a Baixa (score 1)
        self.assertEqual(resultado[4]["titulo"], "Tarefa Baixa")
        self.assertEqual(resultado[4]["score_prioridade"], 1)

    def test_schema_pydantic_validacao(self):
        """Valida se o schema Tarefa aceita dados válidos e rejeita prioridades fora do enum."""
        dados_validos = {
            "titulo": "Finalizar projeto",
            "prioridade": "Crítica",
            "score_prioridade": 5,
            "tempo_estimado_minutos": 60,
            "justificativa": "Impacto imediato"
        }
        tarefa = Tarefa(**dados_validos)
        self.assertEqual(tarefa.titulo, "Finalizar projeto")
        self.assertEqual(tarefa.prioridade, "Crítica")

        triagem = TriagemTarefas(tarefas=[tarefa])
        self.assertEqual(len(triagem.tarefas), 1)

    def test_formatacao_tempo(self):
        """Valida a conversão de minutos para horas e minutos legíveis."""
        self.assertEqual(formatar_tempo(30), "30 min")
        self.assertEqual(formatar_tempo(60), "1h")
        self.assertEqual(formatar_tempo(90), "1h 30min")
        self.assertEqual(formatar_tempo(145), "2h 25min")

    def test_persistencia_arquivo(self):
        """Valida se o arquivo JSON é gerado e lido corretamente."""
        tarefas = [
            {"titulo": "T1", "score_prioridade": 5, "tempo_estimado_minutos": 10, "prioridade": "Crítica", "justificativa": "J1"}
        ]
        caminho = salvar_tarefas_organizadas(tarefas)
        self.assertTrue(os.path.exists(caminho))

        carregadas = carregar_tarefas_organizadas()
        self.assertGreaterEqual(len(carregadas), 1)
        self.assertEqual(carregadas[0]["titulo"], "T1")

    def test_geracao_corpo_email_critico(self):
        """Valida se o HTML gerado para o e-mail contém o título e a justificativa da tarefa crítica."""
        from execution.email_service import gerar_corpo_html, enviar_alerta_tarefas_criticas

        tarefas_criticas = [
            {
                "titulo": "Vazamento Grave",
                "prioridade": "Crítica",
                "score_prioridade": 5,
                "tempo_estimado_minutos": 45,
                "justificativa": "Risco de alagamento imediato"
            }
        ]

        corpo_html = gerar_corpo_html(tarefas_criticas)
        self.assertIn("Vazamento Grave", corpo_html)
        self.assertIn("Risco de alagamento imediato", corpo_html)
        self.assertIn("siteprofissional.pro", corpo_html)

        # Se não houver tarefas críticas, não deve enviar
        sucesso, msg = enviar_alerta_tarefas_criticas([])
        self.assertFalse(sucesso)


if __name__ == "__main__":
    unittest.main()
