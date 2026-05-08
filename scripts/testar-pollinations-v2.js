/**
 * testar-pollinations-v2.js — Teste REAL: imagens concretas para slides de carrossel
 * 
 * Simula um carrossel sobre "produtividade para freelancers"
 * e gera uma imagem concreta para cada slide.
 * 
 * Usa os 2 melhores modelos gratuitos: gptimage e flux
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'teste-carrossel-real');

// Slides de um carrossel real com prompts concretos
const SLIDES = [
  {
    slide: 'slide-01-hook',
    mensagem: 'Descobri que 90% dos freelancers perdem 3h por dia',
    prompt: 'A stressed freelancer sitting at a cluttered desk with a laptop, coffee cups everywhere, papers scattered, clock on the wall showing late hours, warm dramatic lighting, cinematic photography style, dark moody background, no text',
  },
  {
    slide: 'slide-02-problema',
    mensagem: 'O problema é que eles tratam tarefas como uma lista infinita',
    prompt: 'Overhead view of a chaotic desk with dozens of colorful sticky notes and post-it notes scattered everywhere, an overwhelmed to-do list on paper, messy workspace, dramatic top-down photography, dark background, no text',
  },
  {
    slide: 'slide-03-revelacao',
    mensagem: 'Existe um método de 3 blocos que muda tudo',
    prompt: 'Three clean minimal wooden blocks arranged in a row on a dark desk, each block glowing with soft warm light, organized and peaceful atmosphere, minimal zen workspace, cinematic lighting, product photography style, no text',
  },
  {
    slide: 'slide-04-resultado',
    mensagem: 'Clientes que aplicaram reduziram 40% do tempo em tarefas',
    prompt: 'A happy confident freelancer working on a clean minimal desk with just a laptop and a coffee cup, golden hour light coming through window, organized peaceful workspace, sense of achievement, cinematic photography, no text',
  },
];

// Modelos para testar
const MODELOS = ['gptimage', 'flux'];

function baixarImagem(url, outputPath) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout 120s')), 120000);
    
    const follow = (currentUrl) => {
      const client = currentUrl.startsWith('https') ? https : require('http');
      client.get(currentUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return follow(res.headers.location);
        }
        if (res.statusCode !== 200) {
          clearTimeout(timeout);
          reject(new Error(`Status ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          clearTimeout(timeout);
          const buffer = Buffer.concat(chunks);
          fs.writeFileSync(outputPath, buffer);
          const sizeKB = (buffer.length / 1024).toFixed(0);
          console.log(`  ✅ ${sizeKB} KB → ${path.basename(outputPath)}`);
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
  
  console.log('═══════════════════════════════════════════════════');
  console.log('  TESTE v2 — Imagens concretas para carrossel');
  console.log('═══════════════════════════════════════════════════\n');

  for (const slide of SLIDES) {
    console.log(`\n📝 ${slide.slide}: "${slide.mensagem}"`);
    console.log(`   Prompt: "${slide.prompt.substring(0, 80)}..."`);
    
    for (const modelo of MODELOS) {
      const encodedPrompt = encodeURIComponent(slide.prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1350&model=${modelo}&nologo=true&seed=${Date.now()}`;
      const outputPath = path.join(OUTPUT_DIR, `${slide.slide}-${modelo}.png`);
      
      console.log(`  🎨 ${modelo}...`);
      const inicio = Date.now();
      
      try {
        await baixarImagem(url, outputPath);
        console.log(`     ⏱️  ${((Date.now() - inicio) / 1000).toFixed(1)}s`);
      } catch (err) {
        console.log(`  ❌ ${err.message}`);
      }
    }
  }
  
  console.log(`\n📁 Todas as imagens em: ${OUTPUT_DIR}\n`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
