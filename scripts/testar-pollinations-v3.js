/**
 * testar-pollinations-v3.js — Testa TODOS os modelos gratuitos com prompts concretos
 * 
 * Foco: achar o melhor modelo gratuito pra carrossel
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'teste-todos-modelos');

// TODOS os modelos gratuitos disponíveis
const MODELOS = [
  { id: 'flux', nome: 'Flux Schnell (Flux 1)' },
  { id: 'klein', nome: 'FLUX.2 Klein 4B' },
  { id: 'zimage', nome: 'Z-Image Turbo (6B + upscale 2x)' },
  { id: 'gptimage-large', nome: 'GPT Image 1.5' },
  { id: 'wan-image', nome: 'Wan 2.7 (Alibaba)' },
  { id: 'qwen-image', nome: 'Qwen Image Plus (Alibaba)' },
  { id: 'kontext', nome: 'FLUX.1 Kontext' },
];

// 2 prompts concretos para testar — um com pessoa, um com objetos
const PROMPTS = [
  {
    nome: 'hook-freelancer',
    prompt: 'A stressed freelancer sitting at a cluttered desk with a laptop, coffee cups everywhere, papers scattered, clock on the wall showing late hours, warm dramatic lighting, cinematic photography style, dark moody background, no text, ultra realistic, 8k, professional photography',
  },
  {
    nome: 'post-its-caos',
    prompt: 'Overhead view of a chaotic desk covered with hundreds of colorful sticky notes and post-it notes, overwhelmed to-do list, messy workspace, dramatic top-down photography, dark background, no text, ultra realistic, 8k, professional photography',
  },
];

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
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TESTE v3 — TODOS os modelos gratuitos, prompts concretos');
  console.log('═══════════════════════════════════════════════════════════\n');

  const resultados = [];

  for (const promptObj of PROMPTS) {
    console.log(`\n━━━ CENA: ${promptObj.nome} ━━━`);
    console.log(`Prompt: "${promptObj.prompt.substring(0, 90)}..."\n`);
    
    for (const modelo of MODELOS) {
      const encodedPrompt = encodeURIComponent(promptObj.prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1350&model=${modelo.id}&nologo=true&seed=42`;
      const outputPath = path.join(OUTPUT_DIR, `${promptObj.nome}--${modelo.id}.png`);
      
      process.stdout.write(`  🎨 ${modelo.nome.padEnd(35)}`);
      const inicio = Date.now();
      
      try {
        const result = await baixarImagem(url, outputPath);
        const tempo = ((Date.now() - inicio) / 1000).toFixed(1);
        const sizeKB = (result.size / 1024).toFixed(0);
        console.log(`✅ ${tempo}s | ${sizeKB} KB`);
        resultados.push({ cena: promptObj.nome, modelo: modelo.nome, id: modelo.id, tempo, sizeKB, sucesso: true });
      } catch (err) {
        const tempo = ((Date.now() - inicio) / 1000).toFixed(1);
        console.log(`❌ ${err.message} (${tempo}s)`);
        resultados.push({ cena: promptObj.nome, modelo: modelo.nome, id: modelo.id, tempo, sucesso: false, erro: err.message });
      }
    }
  }
  
  // Resumo
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  RANKING POR TAMANHO (mais KB = mais detalhe)');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const sucesso = resultados.filter(r => r.sucesso);
  sucesso.sort((a, b) => parseInt(b.sizeKB) - parseInt(a.sizeKB));
  
  for (const r of sucesso) {
    console.log(`  ${r.sizeKB.padStart(5)} KB | ${r.modelo.padEnd(35)} | ${r.cena} | ${r.tempo}s`);
  }
  
  const falhas = resultados.filter(r => !r.sucesso);
  if (falhas.length) {
    console.log('\n  FALHAS:');
    for (const r of falhas) {
      console.log(`  ❌ ${r.modelo.padEnd(35)} | ${r.cena} | ${r.erro}`);
    }
  }
  
  console.log(`\n📁 Imagens em: ${OUTPUT_DIR}\n`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
