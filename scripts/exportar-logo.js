/**
 * exportar-logo.js — Exporta o logo SVG como PNG em múltiplos tamanhos
 *
 * Uso:
 *   node scripts/exportar-logo.js
 *
 * Gera:
 *   marca/logo-512.png   — ícone para redes sociais, favicon, uso geral
 *   marca/logo-1024.png  — versão alta resolução
 */

const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const svgPath = path.join(raiz, 'marca', 'logo.svg');

if (!fs.existsSync(svgPath)) {
  console.error('Erro: marca/logo.svg não encontrado.');
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf-8');

// HTML wrapper: fundo transparente, SVG centralizado preenchendo o viewport
function criarHtml(tamanho) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${tamanho}px; height: ${tamanho}px; background: transparent; }
  body { display: flex; align-items: center; justify-content: center; }
  svg { width: ${tamanho}px; height: ${tamanho}px; }
</style>
</head>
<body>${svgContent}</body>
</html>`;
}

async function exportar() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Erro: Puppeteer não está instalado. Execute: npm install');
    process.exit(1);
  }

  const tamanhos = [512, 1024];

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const tamanho of tamanhos) {
    const page = await browser.newPage();
    await page.setViewport({ width: tamanho, height: tamanho, deviceScaleFactor: 1 });
    await page.setContent(criarHtml(tamanho), { waitUntil: 'networkidle0' });

    const outputPath = path.join(raiz, 'marca', `logo-${tamanho}.png`);
    await page.screenshot({ path: outputPath, omitBackground: true });
    await page.close();

    console.log(`Exportado: marca/logo-${tamanho}.png`);
  }

  await browser.close();
  console.log('\nPronto. Arquivos salvos em marca/');
}

exportar().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
