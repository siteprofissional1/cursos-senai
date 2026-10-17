"""
Módulo de Extração da Hierarquia Geográfica Brasileira
Gera o arquivo geo_hierarchy.json mapeando Região -> UF -> Municípios
Padrão SENAI - Clean Code & Alta Performance
"""

import os
import json
import duckdb

UF_TO_REGION = {
    # Norte
    "AC": "Norte", "AP": "Norte", "AM": "Norte", "PA": "Norte", "RO": "Norte", "RR": "Norte", "TO": "Norte",
    # Nordeste
    "AL": "Nordeste", "BA": "Nordeste", "CE": "Nordeste", "MA": "Nordeste", "PB": "Nordeste", 
    "PE": "Nordeste", "PI": "Nordeste", "RN": "Nordeste", "SE": "Nordeste",
    # Centro-Oeste
    "DF": "Centro-Oeste", "GO": "Centro-Oeste", "MT": "Centro-Oeste", "MS": "Centro-Oeste",
    # Sudeste
    "ES": "Sudeste", "MG": "Sudeste", "RJ": "Sudeste", "SP": "Sudeste",
    # Sul
    "PR": "Sul", "RS": "Sul", "SC": "Sul"
}

def generate_hierarchy():
    csv_path = "data/microdados_enem_2025/DADOS/RESULTADOS_2025.csv"
    output_path = "data/processed/geo_hierarchy.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    print("Conectando ao DuckDB para extração geográfica...")
    conn = duckdb.connect()

    # Query ultra rápida para obter UFs e Municípios únicos
    query = f"""
    SELECT DISTINCT 
        SG_UF_PROVA as uf,
        NO_MUNICIPIO_PROVA as municipio
    FROM read_csv('{csv_path}', delim=';', header=True, encoding='latin-1', auto_detect=True)
    WHERE SG_UF_PROVA IS NOT NULL AND NO_MUNICIPIO_PROVA IS NOT NULL
    ORDER BY SG_UF_PROVA, NO_MUNICIPIO_PROVA
    """
    
    df = conn.execute(query).fetchdf()
    print(f"Total de pares UF/Município extraídos: {len(df)}")

    hierarchy = {
        "Norte": {},
        "Nordeste": {},
        "Centro-Oeste": {},
        "Sudeste": {},
        "Sul": {}
    }

    for _, row in df.iterrows():
        uf = str(row["uf"]).strip()
        municipio = str(row["municipio"]).strip()
        regiao = UF_TO_REGION.get(uf, "Outro")
        
        if regiao not in hierarchy:
            hierarchy[regiao] = {}
        if uf not in hierarchy[regiao]:
            hierarchy[regiao][uf] = []
        hierarchy[regiao][uf].append(municipio)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(hierarchy, f, ensure_ascii=False, indent=2)

    print(f"Hierarquia geográfica salva com sucesso em: {output_path}")

if __name__ == "__main__":
    generate_hierarchy()
