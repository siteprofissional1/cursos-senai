"""
Ponto de Entrada da API FastAPI - EduScore
Padrão SENAI - Clean Code, Assíncrono e Alta Concorrência
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import status, filters, analytics, schools, ingestion, simulator

app = FastAPI(
    title="EduScore API",
    description="Plataforma Analítica de Alta Performance para Microdados do ENEM 2025",
    version="2.0.0"
)

# Configuração de CORS para permitir requisições do frontend React/Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão dos roteadores modulares
app.include_router(status.router)
app.include_router(filters.router)
app.include_router(analytics.router)
app.include_router(schools.router)
app.include_router(ingestion.router)
app.include_router(simulator.router)

@app.get("/")
async def root():
    return {
        "sistema": "EduScore",
        "versao": "2.0.0",
        "status": "online",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
