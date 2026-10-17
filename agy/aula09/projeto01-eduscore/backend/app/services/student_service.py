"""
Serviço de Anonimização Humanizada de Estudantes Brasileiros
Gera nomes determinísticos realistas a partir do hash do identificador do aluno
Padrão SENAI - Clean Code & Privacidade LGPD
"""

import hashlib

NOMES_MASCULINOS = [
    "Gabriel", "Lucas", "Matheus", "Pedro", "Guilherme", "Gustavo", "Felipe", "Rafael", 
    "Arthur", "Bernardo", "Enzo", "Cauã", "Vitor", "Eduardo", "Leonardo", "Samuel", 
    "Thiago", "Vinicius", "Rodrigo", "Bruno", "Caio", "Diego", "Daniel", "Heitor", 
    "Davi", "Murilo", "Enrico", "Breno", "Henrique", "Lorenzo", "Theo", "Joaquim"
]

NOMES_FEMININOS = [
    "Beatriz", "Mariana", "Ana", "Larissa", "Camila", "Juliana", "Isabela", "Bruna", 
    "Carolina", "Leticia", "Gabriela", "Amanda", "Fernanda", "Jessica", "Luana", "Julia", 
    "Leticia", "Sofia", "Helena", "Alice", "Laura", "Manuela", "Valentina", "Lorena", 
    "Yasmin", "Giovanna", "Clara", "Rafaela", "Bianca", "Nicole", "Heloisa", "Rebeca"
]

SOBRENOMES = [
    "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", 
    "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", 
    "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha", "Dias", "Nascimento", "Andrade", 
    "Moreira", "Nunes", "Marques", "Machado", "Mendes", "Freitas", "Cardoso", "Ramos", 
    "Gonçalves", "Santana", "Teixeira", "Araujo", "Castro", "Cavalcante", "Borges", "Moraes"
]

def generate_student_name(student_id: int | str, gender: str = "U") -> str:
    """
    Gera um nome brasileiro realista de forma estritamente determinística
    a partir do identificador único do estudante.
    """
    id_str = str(student_id).strip()
    h = hashlib.sha256(id_str.encode("utf-8")).hexdigest()
    
    # Converter blocos do hash em inteiros
    val1 = int(h[0:4], 16)
    val2 = int(h[4:8], 16)
    val3 = int(h[8:12], 16)

    gender_norm = str(gender).upper().strip() if gender else "U"
    if gender_norm == "M":
        primeiro_nome = NOMES_MASCULINOS[val1 % len(NOMES_MASCULINOS)]
    elif gender_norm == "F":
        primeiro_nome = NOMES_FEMININOS[val1 % len(NOMES_FEMININOS)]
    else:
        # Alternância determinística
        if (val1 % 2) == 0:
            primeiro_nome = NOMES_MASCULINOS[val1 % len(NOMES_MASCULINOS)]
        else:
            primeiro_nome = NOMES_FEMININOS[val1 % len(NOMES_FEMININOS)]

    sobrenome1 = SOBRENOMES[val2 % len(SOBRENOMES)]
    sobrenome2 = SOBRENOMES[val3 % len(SOBRENOMES)]

    # Evita repetição de sobrenome duplo idêntico
    if sobrenome1 == sobrenome2:
        sobrenome2 = SOBRENOMES[(val3 + 7) % len(SOBRENOMES)]

    return f"{primeiro_nome} {sobrenome1} {sobrenome2}"
