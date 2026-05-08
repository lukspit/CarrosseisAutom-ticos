/**
 * testar-pollinations-v4.js — Testa modelos DIFERENTES de verdade
 * 
 * Usa seeds únicas por modelo para evitar cache
 * Testa 1 prompt concreto em todos os modelos gratuitos
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'teste-modelos-v4');

const MODELOS = [
  { id: 'flux', nome: 'Flux Schnell' },
  { id: 'klein', nome: 'FLUX.2 Klein 4B' },
  { id: 'zimage', nome: 'Z-Image Turbo' },
  { id: 'gptimage-large', nome: 'GPT Image 1.5' },
  { id: 'wan-image', nome: 'Wan 2.7 Alibaba' },
  { id: 'qwen-image', nome: 'Qwen Image Plus' },
];

const PROMPT = 'A stressed freelancer sitting at a cluttered desk with a laptop, coffee cups everywhere, papers scattered, clock on the wall showing late hours, warm dramatic lighting, cinematic photography style, dark moody background, no text, ultra realistic, 8k, professional photography';

function baixarImagem(url, outputPath) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout 180s')), 180000);
    const follow = (currentUrl, depth = 0) => {
      if (depth > 5) { clearTimeout(timeout); reject(new Error('Too many redirects')); return; }
      const client = currentUrl.startsWith('https') ? https : require('http');
      client.get(currentUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return follow(res.headers.location, depth + 1);
        }
        if (res.statusCode !== 200) {
          clearTimeout(timeout);
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          clearTimeout(timeout);
          const buffer = Buffer.concat(chunks);
          fs.writeFileSync(outputPath, buffer);
          resolve({ path: outputPath, size: buffer.length });
        });
        res.on('error', (err) => { clearTimeout(timeout); reject(err); });
      }).on('error', (err) => { clearTimeout(timeout); reject(err); });
    };
    follow(url);
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  console.log('═══════════════════════════════════════════');
  console.log('  TESTE v4 — Cada modelo com seed única');
  console.log('═══════════════════════════════════════════');
  console.log(`\nPrompt: "${PROMPT.substring(0, 80)}..."\n`);

  const resultados = [];

  for (let i = 0; i < MODELOS.length; i++) {
    const modelo = MODELOS[i];
    // Seed única por modelo para evitar cache
    const seed = 1000 + (i * 777);
    const encodedPrompt = encodeURIComponent(PROMPT);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1350&model=${modelo.id}&nologo=true&seed=${seed}&nofeed=true`;
    const outputPath = path.join(OUTPUT_DIR, `${(i+1).toString().padStart(2,'0')}-${modelo.id}.png`);
    
    process.stdout.write(`  ${i+1}/${MODELOS.length} 🎨 ${modelo.nome.padEnd(25)} (seed=${seed}) `);
    const inicio = Date.now();
    
    try {
      const result = await baixarImagem(url, outputPath);
      const tempo = ((Date.now() - inicio) / 1000).toFixed(1);
      const sizeKB = (result.size / 1024).toFixed(0);
      console.log(`✅ ${tempo}s | ${sizeKB} KB`);
      resultados.push({ ...modelo, tempo, sizeKB: parseInt(sizeKB), sucesso: true, seed });
    } catch (err) {
      const tempo = ((Date.now() - inicio) / 1000).toFixed(1);
      console.log(`❌ ${err.message} (${tempo}s)`);
      resultados.push({ ...modelo, tempo, sucesso: false, erro: err.message });
    }
  }
  
  console.log('\n═══════════════════════════════════════════');
  console.log('  RESULTADO');
  console.log('═══════════════════════════════════════════\n');
  
  const ok = resultados.filter(r => r.sucesso).sort((a, b) => b.sizeKB - a.sizeKB);
  for (const r of ok) {
    console.log(`  ${r.sizeKB.toString().padStart(5)} KB | ${r.nome.padEnd(25)} | ${r.tempo}s`);
  }
  
  console.log(`\n📁 ${OUTPUT_DIR}\n`);
}

main();
