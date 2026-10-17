"""
Gerenciador de Conexão com o Banco Analítico DuckDB
Padrão SENAI - Clean Code, Thread-Safe & Sub-Segundo
"""

import duckdb
from backend.app.core.config import DUCKDB_PATH

class DuckDBManager:
    _connection = None

    @classmethod
    def get_connection(cls) -> duckdb.DuckDBPyConnection:
        """
        Retorna uma conexão DuckDB em modo somente leitura (read_only=True).
        DuckDB suporta múltiplas conexões simultâneas concorrentes em modo read-only.
        """
        return duckdb.connect(str(DUCKDB_PATH), read_only=True)

    @classmethod
    def execute_query(cls, query: str, params: tuple = ()):
        """
        Executa uma consulta e retorna os resultados de forma segura.
        """
        with cls.get_connection() as conn:
            return conn.execute(query, params).fetchall()

    @classmethod
    def execute_df(cls, query: str, params: tuple = ()):
        """
        Executa uma consulta e retorna um DataFrame Polars/Pandas.
        """
        with cls.get_connection() as conn:
            return conn.execute(query, params).fetchdf()

def _round1(val: float | None) -> float | None:
    """
    Função utilitária mandatória: arredonda estritamente para 1 casa decimal
    evitando oscilações ou dízimas no layout visual.
    """
    if val is None:
        return None
    return round(float(val), 1)
