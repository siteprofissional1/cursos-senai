"""
Script de Geração do Cardápio em PDF - Pizzaria do Joselito
Gera um cardápio profissional em formato PDF (2 páginas A4), estilo Dark & Premium,
com tipografia Segoe UI, imagem gourmet integrada, preços, detalhes e links clicáveis.
"""

import os
import pymupdf

def hex_to_rgb(hex_str: str):
    """Converte código hexadecimal (#RRGGBB ou #RGB) para tupla RGB normalizada (0.0 a 1.0)."""
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = "".join(c * 2 for c in hex_str)
    return tuple(int(hex_str[i:i+2], 16) / 255.0 for i in (0, 2, 4))

def create_cardapio_pdf(output_path: str, banner_path: str):
    # Dimensões da folha A4 em pontos (72 pontos por polegada)
    PAGE_WIDTH = 595.3
    PAGE_HEIGHT = 841.9
    
    # Paleta de cores oficial (Dark & Premium)
    COLOR_BG = hex_to_rgb("#111216")
    COLOR_CARD = hex_to_rgb("#181a20")
    COLOR_CARD_BORDER = hex_to_rgb("#2c2f38")
    COLOR_RED = hex_to_rgb("#e31b23")
    COLOR_BLUE = hex_to_rgb("#0057b8")
    COLOR_GOLD = hex_to_rgb("#f5a623")
    COLOR_WHITE = hex_to_rgb("#ffffff")
    COLOR_TEXT_MUTED = hex_to_rgb("#b0b4be")
    COLOR_TEXT_DIM = hex_to_rgb("#7a808e")
    
    # Carregamento de fontes Segoe UI instaladas no sistema
    FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"
    FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
    FONT_SEMIBOLD = "C:/Windows/Fonts/seguisb.ttf"
    
    doc = pymupdf.open()
    
    def apply_page_background(page):
        # Fundo escuro principal
        page.draw_rect(pymupdf.Rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT), color=None, fill=COLOR_BG)
        # Moldura estética sutil com cantos arredondados
        page.draw_rect(pymupdf.Rect(18, 18, PAGE_WIDTH - 18, PAGE_HEIGHT - 18), 
                       color=hex_to_rgb("#232630"), width=1.2, radius=0.015)
        # Cantos decorativos estilizados
        c_len = 16
        corners = [
            ((18, 18), (18 + c_len, 18), (18, 18 + c_len)),
            ((PAGE_WIDTH - 18, 18), (PAGE_WIDTH - 18 - c_len, 18), (PAGE_WIDTH - 18, 18 + c_len)),
            ((18, PAGE_HEIGHT - 18), (18 + c_len, PAGE_HEIGHT - 18), (18, PAGE_HEIGHT - 18 - c_len)),
            ((PAGE_WIDTH - 18, PAGE_HEIGHT - 18), (PAGE_WIDTH - 18 - c_len, PAGE_HEIGHT - 18), (PAGE_WIDTH - 18, PAGE_HEIGHT - 18 - c_len)),
        ]
        for origin, h_pt, v_pt in corners:
            page.draw_line(origin, h_pt, color=COLOR_RED, width=1.5)
            page.draw_line(origin, v_pt, color=COLOR_RED, width=1.5)

    # =========================================================================
    # PÁGINA 1: PIZZAS TRADICIONAIS & ESPECIAIS
    # =========================================================================
    page1 = doc.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
    apply_page_background(page1)
    
    # Fontes registradas no documento para uso na página
    page1.insert_font(fontname="SegoeUI", fontfile=FONT_REGULAR)
    page1.insert_font(fontname="SegoeUI-Bold", fontfile=FONT_BOLD)
    page1.insert_font(fontname="SegoeUI-SemiBold", fontfile=FONT_SEMIBOLD)
    
    # 1. Topo: Inserção de Banner Gourmet se existir
    banner_top = 26
    banner_height = 110
    banner_rect = pymupdf.Rect(26, banner_top, PAGE_WIDTH - 26, banner_top + banner_height)
    if os.path.exists(banner_path):
        page1.insert_image(banner_rect, filename=banner_path, keep_proportion=False)
        # Overlay escuro degradê sobre o banner para dar contraste
        page1.draw_rect(banner_rect, color=None, fill=hex_to_rgb("#000000"), fill_opacity=0.38)
        page1.draw_rect(banner_rect, color=COLOR_RED, width=1.5, radius=0.03)
    
    # 2. Cabeçalho Principal (Título e Slogan sobre o banner)
    page1.insert_text((42, banner_top + 34), "PIZZARIA DO JOSELITO", 
                      fontname="SegoeUI-Bold", fontsize=24, color=COLOR_WHITE)
    page1.insert_text((42, banner_top + 55), "CARDÁPIO OFICIAL • FORNO A LENHA & TRADIÇÃO ARTESANAL", 
                      fontname="SegoeUI-Bold", fontsize=10, color=COLOR_GOLD)
    
    # Informações de contato e atendimento em destaque
    info_rect = pymupdf.Rect(40, banner_top + 68, PAGE_WIDTH - 40, banner_top + 98)
    page1.draw_rect(info_rect, color=None, fill=hex_to_rgb("#111317"), fill_opacity=0.88, radius=0.08)
    page1.draw_rect(info_rect, color=COLOR_GOLD, width=0.8, radius=0.08)
    
    info_text = "Pedidos WhatsApp: (14) 99999-9999  |  Terça a Domingo: 18h às 23h30  |  Delivery & Retirada"
    page1.insert_textbox(info_rect, info_text, fontname="SegoeUI-Bold", fontsize=9.2, 
                         color=COLOR_WHITE, align=pymupdf.TEXT_ALIGN_CENTER)
    
    # Função auxiliar para desenhar título de categoria
    def draw_category_header(page, y_pos, title, badge_color):
        header_rect = pymupdf.Rect(26, y_pos, PAGE_WIDTH - 26, y_pos + 26)
        page.draw_rect(header_rect, color=None, fill=badge_color, radius=0.08)
        page.insert_text((38, y_pos + 18), title, 
                         fontname="SegoeUI-Bold", fontsize=11.5, color=COLOR_WHITE)
        return y_pos + 32

    # Função auxiliar para desenhar item de pizza
    def draw_pizza_item(page, y_pos, name, desc, price, is_novo=False, is_top=False):
        item_rect = pymupdf.Rect(26, y_pos, PAGE_WIDTH - 26, y_pos + 36)
        page.draw_rect(item_rect, color=COLOR_CARD_BORDER, fill=COLOR_CARD, width=0.6, radius=0.05)
        
        # Nome da pizza
        page.insert_text((36, y_pos + 16), name,
                         fontname="SegoeUI-Bold", fontsize=11, color=COLOR_WHITE)
        
        # Tags opcionais (NOVO ou TOP)
        x_tag = 36 + len(name) * 6.5 + 10
        if is_top:
            tag_rect = pymupdf.Rect(x_tag, y_pos + 6, x_tag + 34, y_pos + 19)
            page.draw_rect(tag_rect, color=None, fill=COLOR_RED, radius=0.2)
            page.insert_text((x_tag + 6, y_pos + 16), "TOP", fontname="SegoeUI-Bold", fontsize=7.5, color=COLOR_WHITE)
        elif is_novo:
            tag_rect = pymupdf.Rect(x_tag, y_pos + 6, x_tag + 40, y_pos + 19)
            page.draw_rect(tag_rect, color=None, fill=COLOR_GOLD, radius=0.2)
            page.insert_text((x_tag + 5, y_pos + 16), "NOVO", fontname="SegoeUI-Bold", fontsize=7.5, color=hex_to_rgb("#111111"))

        # Preço alinhado à direita
        page.insert_text((PAGE_WIDTH - 96, y_pos + 17), price,
                         fontname="SegoeUI-Bold", fontsize=12, color=COLOR_GOLD)
        
        # Descrição dos ingredientes
        page.insert_text((36, y_pos + 30), desc,
                         fontname="SegoeUI", fontsize=8.6, color=COLOR_TEXT_MUTED)
        
        return y_pos + 42

    # --- CATEGORIA 1: PIZZAS TRADICIONAIS ---
    y = banner_top + banner_height + 14
    y = draw_category_header(page1, y, "PIZZAS TRADICIONAIS (8 FATIAS)", COLOR_RED)
    
    tradicionais = [
        ("01. Calabresa Especial", "Molho de tomate caseiro, mussarela, fatias de calabresa defumada, cebola roxa e orégano.", "R$ 48,90", False, True),
        ("02. Mussarela Premium", "Molho rústico, camada generosa de mussarela curada, rodelas de tomate e azeitonas pretas.", "R$ 46,90", False, False),
        ("03. Portuguesa do Joselito", "Presunto selecionado, mussarela, ovos cozidos, cebola fresca, ervilhas e orégano.", "R$ 52,90", False, True),
        ("04. Margherita Clássica", "Mussarela, rodelas de tomate caqui, queijo parmesão ralado e folhas de manjericão fresco.", "R$ 49,90", False, False),
        ("05. Frango com Catupiry Original", "Frango desfiado temperado com ervas, milho verde selecionado e Catupiry legítimo.", "R$ 54,90", False, True),
        ("06. Quatro Queijos Real", "Mussarela, provolone curado, gorgonzola importado e requeijão cremoso especial.", "R$ 56,90", False, False),
    ]
    
    for nome, desc, preco, is_novo, is_top in tradicionais:
        y = draw_pizza_item(page1, y, nome, desc, preco, is_novo, is_top)
    
    # --- CATEGORIA 2: PIZZAS ESPECIAIS & GOURMET ---
    y += 4
    y = draw_category_header(page1, y, "PIZZAS ESPECIAIS & GOURMET (RECEITAS DO CHEFE)", COLOR_BLUE)
    
    especiais = [
        ("07. Carne Seca com Cream Cheese", "Carne seca desfiada na manteiga de garrafa, cebola caramelizada e Cream Cheese.", "R$ 64,90", True, False),
        ("08. Pepperoni Artesanal", "Mussarela, fartas fatias de pepperoni crocante, gotas de requeijão e orégano fresco.", "R$ 59,90", False, True),
        ("09. Costela ao Barbecue Suave", "Costela bovina desfiada no bafo, mussarela, molho barbecue artesanal e cheiro verde.", "R$ 66,90", True, False),
        ("10. Lombo com Geleia de Pimenta", "Lombo canadense fatiado, queijo brie derretido e geleia de pimenta agridoce da casa.", "R$ 62,90", False, False),
    ]
    
    for nome, desc, preco, is_novo, is_top in especiais:
        y = draw_pizza_item(page1, y, nome, desc, preco, is_novo, is_top)
        
    # Rodapé da Página 1
    page1.insert_text((PAGE_WIDTH / 2 - 120, PAGE_HEIGHT - 32), 
                      "Continua na página 2  |  Doces, Bordas Recheadas, Bebidas e Combos >", 
                      fontname="SegoeUI-SemiBold", fontsize=8.5, color=COLOR_TEXT_DIM)
    page1.insert_text((PAGE_WIDTH - 75, PAGE_HEIGHT - 32), "Página 1 de 2", 
                      fontname="SegoeUI", fontsize=8.5, color=COLOR_TEXT_DIM)

    # =========================================================================
    # PÁGINA 2: DOCES, BORDAS, BEBIDAS, COMBO & CONTATO
    # =========================================================================
    page2 = doc.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
    apply_page_background(page2)
    
    page2.insert_font(fontname="SegoeUI", fontfile=FONT_REGULAR)
    page2.insert_font(fontname="SegoeUI-Bold", fontfile=FONT_BOLD)
    page2.insert_font(fontname="SegoeUI-SemiBold", fontfile=FONT_SEMIBOLD)
    
    # Mini Header na página 2
    top_p2 = 28
    header2_rect = pymupdf.Rect(26, top_p2, PAGE_WIDTH - 26, top_p2 + 38)
    page2.draw_rect(header2_rect, color=COLOR_CARD_BORDER, fill=COLOR_CARD, radius=0.08)
    page2.insert_text((38, top_p2 + 24), "PIZZARIA DO JOSELITO  •  DOCES, BORDAS, BEBIDAS & COMBOS",
                      fontname="SegoeUI-Bold", fontsize=11.5, color=COLOR_WHITE)
    page2.insert_text((PAGE_WIDTH - 170, top_p2 + 24), "WhatsApp: (14) 99999-9999",
                      fontname="SegoeUI-Bold", fontsize=10.5, color=COLOR_GOLD)
    
    y2 = top_p2 + 48
    
    # --- CATEGORIA 3: PIZZAS DOCES GOURMET ---
    y2 = draw_category_header(page2, y2, "PIZZAS DOCES GOURMET (BROTO OU GRANDE)", hex_to_rgb("#991b1b"))
    
    doces = [
        ("11. Sensação de Morango com Chocolate", "Chocolate ao leite nobre, fatias de morango fresco e raspas de chocolate meio amargo.", "R$ 49,90", False, True),
        ("12. Nutella com Leite Ninho Supremo", "Creme de Nutella original generoso, polvilhado com leite Ninho e pedacinhos de avelã.", "R$ 58,90", False, True),
        ("13. Romeu & Julieta da Fazenda", "Mussarela levemente derretida coberta com cremosa goiabada cascão artesanal.", "R$ 44,90", False, False),
        ("14. Banana Nevada com Canela", "Bananas fatiadas caramelizadas, canela em pó, doce de leite e raspas de chocolate branco.", "R$ 46,90", True, False),
    ]
    for nome, desc, preco, is_novo, is_top in doces:
        y2 = draw_pizza_item(page2, y2, nome, desc, preco, is_novo, is_top)
        
    # --- CATEGORIA 4: BORDAS RECHEADAS (2 Colunas para compactação estética) ---
    y2 += 4
    y2 = draw_category_header(page2, y2, "BORDAS RECHEADAS ARTESANAIS", hex_to_rgb("#a16207"))
    
    bordas = [
        ("• Catupiry Legítimo", "+ R$ 10,00"),
        ("• Cheddar Melt Cremoso", "+ R$ 10,00"),
        ("• Vulcão 4 Queijos Especial", "+ R$ 15,00"),
        ("• Chocolate ao Leite Nobre", "+ R$ 12,00"),
        ("• Doce de Leite com Canela", "+ R$ 12,00"),
        ("• Requeijão com Alho Poró", "+ R$ 11,00"),
    ]
    
    col_w = (PAGE_WIDTH - 52 - 12) / 2
    for idx, (borda_nome, borda_preco) in enumerate(bordas):
        col_idx = idx % 2
        row_idx = idx // 2
        b_x = 26 + col_idx * (col_w + 12)
        b_y = y2 + row_idx * 26
        
        b_rect = pymupdf.Rect(b_x, b_y, b_x + col_w, b_y + 22)
        page2.draw_rect(b_rect, color=COLOR_CARD_BORDER, fill=COLOR_CARD, width=0.6, radius=0.08)
        page2.insert_text((b_x + 8, b_y + 15), borda_nome, fontname="SegoeUI-SemiBold", fontsize=9.2, color=COLOR_WHITE)
        page2.insert_text((b_x + col_w - 55, b_y + 15), borda_preco, fontname="SegoeUI-Bold", fontsize=9.5, color=COLOR_GOLD)
        
    y2 += (len(bordas) // 2) * 26 + 10
    
    # --- CATEGORIA 5: BEBIDAS ---
    y2 = draw_category_header(page2, y2, "BEBIDAS & REFRIGERANTES GELADOS", hex_to_rgb("#0369a1"))
    
    bebidas = [
        ("• Coca-Cola / Guaraná Antarctica 2L", "R$ 14,00"),
        ("• Refrigerante Lata 350ml (Coca, Guaraná, Fanta)", "R$ 6,50"),
        ("• Cerveja Long Neck (Heineken / Stella 330ml)", "R$ 11,00"),
        ("• Sucos Naturais 500ml (Laranja, Uva, Maracujá)", "R$ 9,00"),
        ("• Água Mineral 500ml (com gás ou sem gás)", "R$ 4,50"),
        ("• Cerveja Artesanal IPA 500ml", "R$ 18,00"),
    ]
    
    for idx, (bebida_nome, bebida_preco) in enumerate(bebidas):
        col_idx = idx % 2
        row_idx = idx // 2
        b_x = 26 + col_idx * (col_w + 12)
        b_y = y2 + row_idx * 26
        
        b_rect = pymupdf.Rect(b_x, b_y, b_x + col_w, b_y + 22)
        page2.draw_rect(b_rect, color=COLOR_CARD_BORDER, fill=COLOR_CARD, width=0.6, radius=0.08)
        page2.insert_text((b_x + 8, b_y + 15), bebida_nome, fontname="SegoeUI", fontsize=8.8, color=COLOR_WHITE)
        page2.insert_text((b_x + col_w - 48, b_y + 15), bebida_preco, fontname="SegoeUI-Bold", fontsize=9.5, color=COLOR_GOLD)
        
    y2 += (len(bebidas) // 2) * 26 + 10
    
    # --- CATEGORIA 6: COMBO ESPECIAL DO JOSELITO (Destaque visual) ---
    combo_rect = pymupdf.Rect(26, y2, PAGE_WIDTH - 26, y2 + 48)
    page2.draw_rect(combo_rect, color=COLOR_GOLD, fill=hex_to_rgb("#23180d"), width=1.2, radius=0.08)
    
    page2.insert_text((38, y2 + 20), "COMBO CAMPEÃO DO JOSELITO:", fontname="SegoeUI-Bold", fontsize=11.5, color=COLOR_GOLD)
    page2.insert_text((PAGE_WIDTH - 130, y2 + 22), "APENAS R$ 89,90", fontname="SegoeUI-Bold", fontsize=12.5, color=COLOR_WHITE)
    page2.insert_text((38, y2 + 37), "1 Pizza Salgada Grande + 1 Pizza Doce Broto + 1 Refrigerante 2L à sua escolha!", 
                      fontname="SegoeUI-SemiBold", fontsize=9.5, color=COLOR_WHITE)
    
    y2 += 56
    
    # --- BOTÃO / LINK WHATSAPP INTERATIVO ---
    wpp_rect = pymupdf.Rect(26, y2, PAGE_WIDTH - 26, y2 + 40)
    page2.draw_rect(wpp_rect, color=None, fill=COLOR_RED, radius=0.08)
    
    wpp_text = "FAÇA SEU PEDIDO AGORA NO WHATSAPP: (14) 99999-9999  (CLIQUE AQUI)"
    page2.insert_textbox(wpp_rect, wpp_text, fontname="SegoeUI-Bold", fontsize=10.5, 
                         color=COLOR_WHITE, align=pymupdf.TEXT_ALIGN_CENTER)
    
    # Adicionar hiperlink clicável direto no PDF para o WhatsApp
    page2.insert_link({
        "kind": pymupdf.LINK_URI,
        "from": wpp_rect,
        "uri": "https://wa.me/5514999999999?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido%20pelo%20cardápio."
    })
    
    # Informações de pagamento e taxas
    y2 += 48
    pay_text = "Aceitamos: Pix, Cartões de Débito, Crédito e Vale-Refeição (Alelo, VR, Sodexo)  •  Consulte taxa de entrega para o seu bairro."
    pay_rect = pymupdf.Rect(26, y2, PAGE_WIDTH - 26, y2 + 20)
    page2.insert_textbox(pay_rect, pay_text, fontname="SegoeUI", fontsize=8.2, 
                         color=COLOR_TEXT_DIM, align=pymupdf.TEXT_ALIGN_CENTER)
    
    # =========================================================================
    # RODAPÉ OBRIGATÓRIO (REGRA GLOBAL ANTIGRAVITY):
    # "todo site e aplicacao que criarmos, em baixo voce vai colocar la no final,
    # na ultima linha, centralizado no centro: desenvolvido por siteprofissional e esse
    # escrito do siteprofissional vai ser azul e hiperlink levando para esse endereço siteprofissional.pro"
    # =========================================================================
    
    footer_y = PAGE_HEIGHT - 32
    prefix_text = "desenvolvido por "
    link_text = "siteprofissional"
    
    font_reg = pymupdf.Font(fontfile=FONT_REGULAR)
    font_bld = pymupdf.Font(fontfile=FONT_BOLD)
    
    prefix_w = font_reg.text_length(prefix_text, fontsize=9)
    link_w = font_bld.text_length(link_text, fontsize=9)
    total_w = prefix_w + link_w
    start_x = (PAGE_WIDTH - total_w) / 2
    
    page2.insert_text((start_x, footer_y), prefix_text,
                      fontname="SegoeUI", fontsize=9, color=COLOR_TEXT_DIM)
    
    link_x = start_x + prefix_w
    page2.insert_text((link_x, footer_y), link_text,
                      fontname="SegoeUI-Bold", fontsize=9, color=hex_to_rgb("#0057b8"))
    
    # Inserção do link clicável oficial no PDF
    link_rect = pymupdf.Rect(link_x - 1, footer_y - 10, link_x + link_w + 1, footer_y + 3)
    page2.insert_link({
        "kind": pymupdf.LINK_URI,
        "from": link_rect,
        "uri": "https://siteprofissional.pro"
    })
    
    # Salvar documento PDF com compressão
    doc.save(output_path, garbage=4, deflate=True)
    doc.close()
    print(f"Cardápio PDF gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    out_pdf = os.path.join(current_dir, "cardapio.pdf")
    banner_img = os.path.join(current_dir, "banner-pizza.jpg")
    create_cardapio_pdf(out_pdf, banner_img)
