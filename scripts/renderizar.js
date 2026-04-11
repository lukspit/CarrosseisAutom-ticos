/**
 * renderizar.js — Converte um arquivo HTML em PNG 1080x1350
 *
 * Uso:
 *   node scripts/renderizar.js <caminho-do-html> <caminho-de-saida.png>
 *
 * Exemplo:
 *   node scripts/renderizar.js output/temp/carrossel-produtividade/slide-01.html output/carrossel-produtividade/slide-01.png
 */

const fs = require('fs');
const path = require('path');

// Verifica argumentos
const [,, htmlPath, outputPath] = process.argv;

if (!htmlPath || !outputPath) {
  console.error('Erro: argumentos obrigatórios ausentes.');
  console.error('Uso: node scripts/renderizar.js <html> <saida.png>');
  process.exit(1);
}

if (!fs.existsSync(htmlPath)) {
  console.error(`Erro: arquivo HTML não encontrado: ${htmlPath}`);
  process.exit(1);
}

// Cria o diretório de saída se não existir
const outputDir = path.dirname(outputPath);
fs.mkdirSync(outputDir, { recursive: true });

async function renderizar() {
  let puppeteer;

  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Erro: Puppeteer não está instalado.');
    console.error('Execute: npm install');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Viewport exato 1080x1350 (ratio 4:5 nativo do Instagram)
    await page.setViewport({
      width: 1080,
      height: 1350,
      deviceScaleFactor: 1,
    });

    // Lê o HTML e carrega como conteúdo (evita problemas com file://)
    const html = fs.readFileSync(htmlPath, 'utf-8');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Aguarda carregamento de fontes
    await page.evaluateHandle('document.fonts.ready');

    // Captura o screenshot com clip exato
    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1350 },
    });

    console.log(`Renderizado: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

renderizar().catch((err) => {
  console.error('Erro ao renderizar:', err.message);
  process.exit(1);
});
