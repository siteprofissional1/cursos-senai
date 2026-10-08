# 🖥️ Backend & Persistência de Dados - The Ribs Hamburgueria

Este diretório documenta a camada de dados, arquitetura de persistência e especificações de integração do sistema da **The Ribs Hamburgueria**.

## 📌 Arquitetura Atual: LocalStorage com Event Sourcing

No escopo atual da aplicação, a persistência de dados opera no lado do cliente utilizando o **`localStorage`** do navegador com sincronização entre abas através da API de eventos do DOM (`window.addEventListener('storage', ...)`).

### 🔑 Chaves do LocalStorage

| Chave | Tipo | Descrição |
| :--- | :--- | :--- |
| `theribs_cart` | `Array<CartItem>` | Itens atualmente no carrinho do cliente com quantidades e observações. |
| `theribs_orders` | `Array<Order>` | Fila central de pedidos compartilhada entre cliente e cozinha. |
| `theribs_latest_order_id` | `String` | ID do último pedido realizado pelo cliente na sessão atual. |

### 📋 Estrutura do Objeto `Order` (Pedido)

```json
{
  "id": "TR-4821",
  "createdAt": "2026-09-25T21:30:00.000Z",
  "timeFormatted": "21:30",
  "dateFormatted": "25/09/2026",
  "customerName": "Victor Silva",
  "fulfillmentType": "mesa",
  "fulfillmentDetail": "Mesa 04",
  "tableNumber": "04",
  "deliveryAddress": "",
  "paymentMethod": "Pix",
  "items": [
    {
      "id": "ribs-1",
      "name": "The Grand Cheddar Ribs",
      "numericPrice": 40.50,
      "qty": 2,
      "notes": "Sem cebola em um deles"
    }
  ],
  "totalPrice": 81.00,
  "totalItemsCount": 2,
  "status": "Pendente"
}
```

---

## 🚀 Migração Futura para Backend Real (Node.js / Express ou Firebase)

Para expandir este sistema para múltiplos dispositivos conectados via Wi-Fi do restaurante ou internet externa:

1. **Firebase Firestore:**
   - Coleção `pedidos` com listener em tempo real `onSnapshot()`.
2. **Node.js (Express ou Fastify) com WebSockets:**
   - Servidor com Socket.io para envio instantâneo do evento `novo_pedido` e `status_atualizado`.
