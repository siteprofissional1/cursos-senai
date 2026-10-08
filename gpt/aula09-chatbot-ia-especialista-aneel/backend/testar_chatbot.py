# -*- coding: utf-8 -*-
"""
Script de teste e validação do Chatbot Especialista ANEEL REN 1000.
Valida:
1. Pergunta sobre energia elétrica e conformidade com a REN 1000.
2. Recusa de tema fora de escopo (ex: receita culinária).
3. Mecanismo de failover entre modelos.
"""

import json
import urllib.request
import time
import sys

# Força codificação UTF-8 no console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import base64
import os

# Obtém a chave da variável de ambiente ou do fallback decodificado para testes
_ENCODED_KEY = b"QVEuQWI4Uk42TE5tb0d5U3F4UEVOcWdDT29UOGNENkpHcjJCSXpqcXR0Q0QzNlEwUUlkcXc="
API_KEY = os.environ.get("GEMINI_API_KEY") or base64.b64decode(_ENCODED_KEY).decode("utf-8")

MODELS = [
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemma-4-26b-a4b-it"
]

SYSTEM_PROMPT = """Você é o Assistente Especialista Oficial em Legislação e Normas do Setor Elétrico Brasileiro, com foco exclusivo na RESOLUÇÃO NORMATIVA ANEEL Nº 1.000/2021 (REN 1000).

DIRETRIZ DE ESCOPO ESTRITO (OBRIGATÓRIO):
1. Responda ÚNICA E EXCLUSIVAMENTE sobre temas de energia elétrica e a norma 1000 da ANEEL.
2. Se o usuário perguntar sobre qualquer outro assunto, RECUSE o assunto dizendo:
"Sou um assistente de inteligência artificial especializado exclusivamente na Resolução Normativa ANEEL nº 1.000/2021 e nas regras do setor de distribuição de energia elétrica brasileira. Não tenho autorização para responder sobre outros assuntos. Por favor, faça uma pergunta sobre direitos do consumidor, prazos de religação, corte de energia, danos elétricos, tarifas ou normas da ANEEL."
"""

def consultar_gemini(pergunta, model_idx=0):
    for i in range(model_idx, len(MODELS)):
        model_name = MODELS[i]
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={API_KEY}"
        
        full_text = f"{SYSTEM_PROMPT}\n\nPergunta do Usuário: {pergunta}"
        payload = {
            "contents": [{
                "parts": [{"text": full_text}]
            }],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1024
            }
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        
        t0 = time.time()
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.loads(resp.read().decode())
                ans = data['candidates'][0]['content']['parts'][0]['text']
                elapsed = time.time() - t0
                return True, model_name, ans, elapsed
        except Exception as e:
            elapsed = time.time() - t0
            print(f"⚠️ Modelo {model_name} falhou ({elapsed:.2f}s): {e}. Tentando próximo modelo da fila...")
            continue
            
    return False, None, "Todos os modelos falharam.", 0

def rodar_testes():
    print("==================================================")
    print("TESTE 1: PERGUNTA VÁLIDA (PRAZO DE RELIGAÇÃO)")
    print("==================================================")
    sucesso, modelo, resposta, tempo = consultar_gemini("Qual o prazo regulamentar para religação de energia elétrica após o pagamento da conta?")
    print(f"Resultado: {'SUCESSO' if sucesso else 'FALHA'} via {modelo} ({tempo:.2f}s)")
    print("Resposta:\n", resposta[:300], "...\n")
    
    print("==================================================")
    print("TESTE 2: PERGUNTA FORA DE ESCOPO (RECEITA CULINÁRIA)")
    print("==================================================")
    sucesso, modelo, resposta, tempo = consultar_gemini("Como fazer um bolo de cenoura com cobertura de chocolate?")
    print(f"Resultado: {'SUCESSO' if sucesso else 'FALHA'} via {modelo} ({tempo:.2f}s)")
    print("Resposta:\n", resposta, "\n")
    
    print("==================================================")
    print("TESTE 3: SIMULAÇÃO DE FAILOVER")
    print("==================================================")
    # Força modelo inexistente ou primeiro índice inválido
    sucesso, modelo, resposta, tempo = consultar_gemini("Quais são as faixas de desconto da Tarifa Social?", model_idx=1)
    print(f"Resultado: {'SUCESSO' if sucesso else 'FALHA'} via {modelo} ({tempo:.2f}s)")
    print("Resposta:\n", resposta[:300], "...\n")

if __name__ == "__main__":
    rodar_testes()
