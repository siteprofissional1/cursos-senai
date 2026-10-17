"""
Suíte de Testes Automatizados da API EduScore
Padrão SENAI - Test-Driven Development & Rigor Técnico
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.student_service import generate_student_name
from backend.app.services.school_scraper import is_sigilo_inep

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["sistema"] == "EduScore"
    assert data["status"] == "online"

def test_status_endpoint():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["total_rows"] == 4810772
    assert data["evaluated_rows"] == 3473543
    assert "Pronto" in data["status_db"]

def test_filters_locations():
    response = client.get("/api/filters/locations")
    assert response.status_code == 200
    data = response.json()
    assert "Sudeste" in data
    assert "SP" in data["Sudeste"]
    assert len(data["Sudeste"]["SP"]) > 0

def test_analytics_dashboard_national():
    response = client.get("/api/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()
    
    # Benchmarks nacionais canônicos
    nac = data["nacional_scores"]
    assert nac["media_geral"] == 531.7
    assert nac["media_cn"] == 500.1
    assert nac["media_mt"] == 520.1
    assert nac["media_redacao"] == 590.1

    # Donut charts de presença
    att = data["attendance_brasil"]
    assert att["total_inscritos"] == 4810772
    assert att["avaliados"] == 3473543
    assert att["taxa_presenca"] == 72.2

    # Top 10 Brasil
    assert len(data["top_brasil"]) == 10
    assert data["top_brasil"][0]["media_geral"] >= data["top_brasil"][1]["media_geral"]

def test_analytics_dashboard_filtered_by_uf():
    response = client.get("/api/analytics/dashboard?uf=CE")
    assert response.status_code == 200
    data = response.json()
    
    # Top escolas do filtro devem ser do Ceará
    for esc in data["top_filtro"]:
        assert esc["uf"] == "CE"

def test_schools_list():
    response = client.get("/api/schools?page=1&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    assert len(data["items"]) == 10
    assert data["items"][0]["nome_oficial"] != ""
    assert "(INEP #" not in data["items"][0]["nome_oficial"]

def test_school_details():
    # ID do Colégio Farias Brito Central
    co_escola = 23246871
    response = client.get(f"/api/schools/{co_escola}/details")
    assert response.status_code == 200
    data = response.json()
    assert data["co_escola"] == co_escola
    assert "Farias Brito" in data["nome_oficial"]
    assert len(data["students"]) > 0
    
    # Valida humanização de estudantes
    student = data["students"][0]
    assert len(student["nome_humanizado"].split()) >= 3
    assert student["nu_inscricao_formatada"].startswith("25000")

def test_student_name_determinism():
    # O mesmo ID deve sempre gerar o mesmo nome
    nome1 = generate_student_name(1234567)
    nome2 = generate_student_name(1234567)
    assert nome1 == nome2
    assert len(nome1.split()) >= 3

def test_sigilo_inep():
    assert is_sigilo_inep(60006573) is True
    assert is_sigilo_inep(35399197) is False

def test_simulator_prouni_birigui_sp():
    response = client.get("/api/simulador/oportunidades?programa=prouni&nota=672.5&uf=SP&abrangencia=estado")
    assert response.status_code == 200
    data = response.json()
    assert data["elegivel"] is True
    assert data["programa"] == "prouni"
    assert data["total_oportunidades"] > 0
    assert data["total_aprovadas"] > 0
    # Verifica que tem cidades mapeadas em SP
    cidades = [c["municipio"] for c in data["cidades_mapa"]]
    assert "Birigui" in cidades or "Araçatuba" in cidades or "São Paulo" in cidades

def test_simulator_inelegivel_abaixo_450():
    response = client.get("/api/simulador/oportunidades?programa=prouni&nota=420.0")
    assert response.status_code == 200
    data = response.json()
    assert data["elegivel"] is False
    assert "450" in data["mensagem_elegibilidade"]

