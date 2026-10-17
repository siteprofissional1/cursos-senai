"""
Módulo de Consolidação Estatística de Presença e Abstenção do ENEM 2025
Gera o arquivo geo_attendance.json para carregamento instantâneo no Dashboard
Padrão SENAI - Clean Code & Alta Performance
"""

import os
import json
import duckdb

UF_TO_REGION = {
    "AC": "Norte", "AP": "Norte", "AM": "Norte", "PA": "Norte", "RO": "Norte", "RR": "Norte", "TO": "Norte",
    "AL": "Nordeste", "BA": "Nordeste", "CE": "Nordeste", "MA": "Nordeste", "PB": "Nordeste", 
    "PE": "Nordeste", "PI": "Nordeste", "RN": "Nordeste", "SE": "Nordeste",
    "DF": "Centro-Oeste", "GO": "Centro-Oeste", "MT": "Centro-Oeste", "MS": "Centro-Oeste",
    "ES": "Sudeste", "MG": "Sudeste", "RJ": "Sudeste", "SP": "Sudeste",
    "PR": "Sul", "RS": "Sul", "SC": "Sul"
}

def generate_attendance():
    csv_path = "data/microdados_enem_2025/DADOS/RESULTADOS_2025.csv"
    output_path = "data/processed/geo_attendance.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    print("Conectando ao DuckDB para consolidação de presença e abstenção...")
    conn = duckdb.connect()

    # Query nacional
    print("Processando números nacionais...")
    query_brasil = f"""
    SELECT 
        count(*) as total,
        count(CASE WHEN TP_PRESENCA_CN = 1 OR TP_PRESENCA_CH = 1 OR TP_PRESENCA_LC = 1 OR TP_PRESENCA_MT = 1 THEN 1 END) as avaliados
    FROM read_csv('{csv_path}', delim=';', header=True, encoding='latin-1', auto_detect=True)
    """
    br_res = conn.execute(query_brasil).fetchone()
    total_br = int(br_res[0])
    avaliados_br = int(br_res[1])
    absten_br = total_br - avaliados_br

    attendance_data = {
        "brasil": {
            "total_inscritos": total_br,
            "avaliados": avaliados_br,
            "abstencao": absten_br,
            "taxa_presenca": round((avaliados_br / total_br) * 100, 1),
            "taxa_abstencao": round((absten_br / total_br) * 100, 1)
        },
        "regioes": {},
        "ufs": {},
        "municipios": {}
    }

    # Query por UF
    print("Processando estatísticas por UF...")
    query_uf = f"""
    SELECT 
        SG_UF_PROVA as uf,
        count(*) as total,
        count(CASE WHEN TP_PRESENCA_CN = 1 OR TP_PRESENCA_CH = 1 OR TP_PRESENCA_LC = 1 OR TP_PRESENCA_MT = 1 THEN 1 END) as avaliados
    FROM read_csv('{csv_path}', delim=';', header=True, encoding='latin-1', auto_detect=True)
    WHERE SG_UF_PROVA IS NOT NULL
    GROUP BY SG_UF_PROVA
    """
    uf_rows = conn.execute(query_uf).fetchall()

    regiao_agg = {}

    for uf, total, avaliados in uf_rows:
        uf = str(uf).strip()
        total = int(total)
        avaliados = int(avaliados)
        abstencao = total - avaliados
        pct_pres = round((avaliados / total) * 100, 1) if total > 0 else 0.0
        pct_abs = round((abstencao / total) * 100, 1) if total > 0 else 0.0

        attendance_data["ufs"][uf] = {
            "total_inscritos": total,
            "avaliados": avaliados,
            "abstencao": abstencao,
            "taxa_presenca": pct_pres,
            "taxa_abstencao": pct_abs
        }

        reg = UF_TO_REGION.get(uf, "Outro")
        if reg not in regiao_agg:
            regiao_agg[reg] = {"total": 0, "avaliados": 0}
        regiao_agg[reg]["total"] += total
        regiao_agg[reg]["avaliados"] += avaliados

    # Consolidação por Região
    for reg, d in regiao_agg.items():
        tot = d["total"]
        av = d["avaliados"]
        ab = tot - av
        attendance_data["regioes"][reg] = {
            "total_inscritos": tot,
            "avaliados": av,
            "abstencao": ab,
            "taxa_presenca": round((av / tot) * 100, 1) if tot > 0 else 0.0,
            "taxa_abstencao": round((ab / tot) * 100, 1) if tot > 0 else 0.0
        }

    # Query por Município
    print("Processando estatísticas por Município...")
    query_mun = f"""
    SELECT 
        SG_UF_PROVA as uf,
        NO_MUNICIPIO_PROVA as municipio,
        count(*) as total,
        count(CASE WHEN TP_PRESENCA_CN = 1 OR TP_PRESENCA_CH = 1 OR TP_PRESENCA_LC = 1 OR TP_PRESENCA_MT = 1 THEN 1 END) as avaliados
    FROM read_csv('{csv_path}', delim=';', header=True, encoding='latin-1', auto_detect=True)
    WHERE SG_UF_PROVA IS NOT NULL AND NO_MUNICIPIO_PROVA IS NOT NULL
    GROUP BY SG_UF_PROVA, NO_MUNICIPIO_PROVA
    """
    mun_rows = conn.execute(query_mun).fetchall()
    for uf, mun, total, avaliados in mun_rows:
        key = f"{str(uf).strip()}:{str(mun).strip().lower()}"
        tot = int(total)
        av = int(avaliados)
        ab = tot - av
        attendance_data["municipios"][key] = {
            "total_inscritos": tot,
            "avaliados": av,
            "abstencao": ab,
            "taxa_presenca": round((av / tot) * 100, 1) if tot > 0 else 0.0,
            "taxa_abstencao": round((ab / tot) * 100, 1) if tot > 0 else 0.0
        }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(attendance_data, f, ensure_ascii=False, indent=2)

    print(f"Estatísticas de presença salvas com sucesso em: {output_path}")

if __name__ == "__main__":
    generate_attendance()
