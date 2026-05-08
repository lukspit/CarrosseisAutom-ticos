/**
 * testar-pollinations.js — Testa os modelos de imagem do Pollinations.ai
 * 
 * Uso: node scripts/testar-pollinations.js
 * 
 * Gera imagens com diferentes modelos para comparação.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'testes-pollinations');

// Modelos GRATUITOS para testar
const MODELOS = [
  { id: 'flux', nome: 'Flux Schnell' },
  { id: 'gptimage', nome: 'GPT Image 1 Mini' },
  { id: 'gptimage-large', nome: 'GPT Image 1.5' },
  { id: 'klein', nome: 'FLUX.2 Klein 4B' },
  { id: 'zimage', nome: 'Z-Image Turbo' },
];

// Prompt de teste — simula um slide de carrossel sobre produtividade
const PROMPT = 'Professional dark moody hero image for Instagram carousel about productivity, minimal geometric shapes, deep blue and purple gradient background, abstract light trails, premium feel, no text, 4k quality';

function baixarImagem(url, outputPath) {
  return new Promise((resolve, reject) => {
    const follow = (currentUrl) => {
      const client = currentUrl.startsWith('https') ? https : require('http');
      client.get(currentUrl, (res) => {
        // Segue redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`  ↳ Redirect → ${res.headers.location.substring(0, 80)}...`);
          return follow(res.headers.location);
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode}`));
          return;
        }

        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          fs.writeFileSync(outputPath, buffer);
          const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
          console.log(`  ✅ Salvo: ${outputPath} (${sizeMB} MB)`);
          resolve({ path: outputPath, size: buffer.length });
        });
        res.on('error', reject);
      }).on('error', reject);
    };
    follow(url);
  });
}

async function testarModelo(modelo) {
  const encodedPrompt = encodeURIComponent(PROMPT);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1350&model=${modelo.id}&nologo=true&seed=${Date.now()}`;
  const outputPath = path.join(OUTPUT_DIR, `teste-${modelo.id}.png`);
  
  console.log(`\n🎨 Testando: ${modelo.nome} (${modelo.id})`);
  console.log(`  URL: ${url.substring(0, 100)}...`);
  
  const inicio = Date.now();
  
  try {
    const result = await baixarImagem(url, outputPath);
    const tempo = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`  ⏱️  Tempo: ${tempo}s`);
    return { modelo: modelo.nome, id: modelo.id, tempo, size: result.size, sucesso: true };
  } catch (err) {
    const tempo = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`  ❌ Erro: ${err.message} (${tempo}s)`);
    return { modelo: modelo.nome, id: modelo.id, tempo, sucesso: false, erro: err.message };
  }
}

async function main() {
  // Cria diretório de saída
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  console.log('═══════════════════════════════════════════════════');
  console.log('  TESTE DE MODELOS — Pollinations.ai');
  console.log('═══════════════════════════════════════════════════');
  console.log(`\nPrompt: "${PROMPT}"`);
  console.log(`Tamanho: 1080x1350 (formato Instagram 4:5)`);
  console.log(`Output: ${OUTPUT_DIR}`);
  
  const resultados = [];
  
  for (const modelo of MODELOS) {
    const resultado = await testarModelo(modelo);
    resultados.push(resultado);
  }
  
  // Resumo final
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  RESULTADO');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  
  for (const r of resultados) {
    const status = r.sucesso ? '✅' : '❌';
    const size = r.sucesso ? `${(r.size / 1024).toFixed(0)} KB` : r.erro;
    console.log(`${status} ${r.modelo.padEnd(22)} | ${r.tempo}s | ${size}`);
  }
  
  console.log(`\n📁 Imagens salvas em: ${OUTPUT_DIR}`);
  console.log('Compare as imagens para decidir qual modelo usar!\n');
}

main().catch(err => {
  console.error('Erro geral:', err);
  process.exit(1);
});
