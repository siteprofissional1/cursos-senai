/**
 * Verificação Automatizada dos Rodapés em Todos os Arquivos index.html
 * Joselito Bet VIP
 */

const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../frontend/index.html'),
  path.join(__dirname, '../frontend/tigrinho/index.html'),
  path.join(__dirname, '../frontend/aviao/index.html'),
  path.join(__dirname, '../frontend/roleta/index.html')
];

console.log('🔍 INICIANDO AUDITORIA DOS FOOTERS...');

let allValid = true;

targetFiles.forEach(file => {
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  if (!fs.existsSync(file)) {
    console.error(`❌ Arquivo não encontrado: ${relativePath}`);
    allValid = false;
    return;
  }

  const content = fs.readFileSync(file, 'utf-8');

  // Verifica se o texto antigo "site desenvolvido por" ainda existe
  if (content.includes('site desenvolvido por')) {
    console.error(`❌ ${relativePath}: Contém texto antigo "site desenvolvido por"`);
    allValid = false;
  }

  // Verifica se contém a nova estrutura solicitada
  const hasNewFooter = content.includes('desenvolvido por <a href="https://siteprofissional.pro"') &&
                       content.includes('>siteprofissional</a>');

  if (!hasNewFooter) {
    console.error(`❌ ${relativePath}: Não contém o rodapé novo no formato correto!`);
    allValid = false;
  } else {
    console.log(`✅ ${relativePath}: Rodapé 100% validado! [desenvolvido por siteprofissional -> siteprofissional.pro]`);
  }
});

if (allValid) {
  console.log('\n🏆 TODOS OS 5 ARQUIVOS INDEX.HTML PASSARAM NA AUDITORIA DO FOOTER!');
} else {
  console.error('\n❌ AUDITORIA FALHOU!');
  process.exit(1);
}
