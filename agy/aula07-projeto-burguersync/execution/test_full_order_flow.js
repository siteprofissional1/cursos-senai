/**
 * ==============================================================================
 * BurguerSync Ourinhos - Teste de Fluxo Completo de Pedido e Cozinha (Layer 3)
 * ==============================================================================
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDoc, updateDoc, doc, deleteDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "burguersync777.firebaseapp.com",
  projectId: "burguersync777",
  storageBucket: "burguersync777.firebasestorage.app",
  messagingSenderId: "516138443090",
  appId: "1:516138443090:web:ff0f080f8b32fdcf0dda8b"
};

async function testarFluxoCompleto() {
  console.log("ðŸ” [TESTE END-TO-END] Iniciando fluxo completo de pedido...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const novoPedido = {
    cliente: {
      nome: "Victor CÃ©sar SENAI",
      email: "victor.cesar@senai.br",
      celular: "(14) 99895-1657",
      endereco: "Rua VitÃ³rio Christoni, 1500 - Vila SÃ£o Luiz, Ourinhos-SP",
      obsEntrega: "Portaria principal do SENAI"
    },
    itens: [
      {
        nome: "Ourinhos Smash Burguer",
        preco: 28.00,
        quantidade: 1,
        obsItem: "Sem cebola, queijo bem derretido"
      }
    ],
    pagamento: {
      metodo: "Pix",
      troco: ""
    },
    valores: {
      subtotal: 28.00,
      taxaEntrega: 5.00,
      total: 33.00
    },
    status: "Recebido",
    horario: serverTimestamp()
  };

  // 1. SimulaÃ§Ã£o: Cliente clica em 'Finalizar Pedido'
  console.log("1ï¸âƒ£ [CLIENTE] Enviando pedido via addDoc...");
  const docRef = await addDoc(collection(db, "pedidos"), novoPedido);
  console.log(`âœ… Pedido cadastrado com sucesso! ID: ${docRef.id}`);

  // 2. SimulaÃ§Ã£o: Cozinha recebe o pedido e avanÃ§a para 'Em Preparo'
  console.log("2ï¸âƒ£ [COZINHA] Cozinha avanÃ§a status para 'Em Preparo' via updateDoc...");
  await updateDoc(doc(db, "pedidos", docRef.id), { status: "Em Preparo" });
  
  // 3. Verifica o estado persistido no Firestore
  const pedidoSnap = await getDoc(doc(db, "pedidos", docRef.id));
  const dados = pedidoSnap.data();
  console.log(`âœ… Status verificado no Firestore: ${dados.status}`);

  if (dados.status !== "Em Preparo") {
    throw new Error(`Status esperado 'Em Preparo', recebido: ${dados.status}`);
  }

  // 4. Cozinha avanÃ§a para 'Saiu para Entrega' e depois 'Entregue'
  console.log("3ï¸âƒ£ [COZINHA] AvanÃ§ando para 'Saiu para Entrega'...");
  await updateDoc(doc(db, "pedidos", docRef.id), { status: "Saiu para Entrega" });
  
  console.log("4ï¸âƒ£ [COZINHA] AvanÃ§ando para 'Entregue'...");
  await updateDoc(doc(db, "pedidos", docRef.id), { status: "Entregue" });

  console.log(`\nðŸŽ‰ FLUXO END-TO-END VALIDADO COM 100% DE SUCESSO! ID: ${docRef.id}`);
}

testarFluxoCompleto()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("âŒ Falha no teste end-to-end:", err);
    process.exit(1);
  });

