# /carrossel — Produção do Carrossel

Gera o produto final: copy, planejamento de arte, imagens (se Rota A), código HTML e renderização.
Comando base: `/carrossel [tema]` ou apenas `/carrossel`.

---

## Passo a Passo Metodológico

A esteira de produção deve seguir esta exata ordem lógica. Abrace o contexto de Diretor de Arte definido no `AGENTS.md`.

### Fase 1: Entendimento
- Leia `AGENTS.md` (Para absorver sua persona e a diferença entre Rota A e Rota B).
- Leia `marca/perfil.md` e `pesquisa/instagram-framework.md` (Para ancorar a narrativa).
- Leia `marca/sistema-visual.css` (Para conhecer a paleta).
- Verifique silenciosamente o arquivo `config/.env` para definir se você está operando na Rota A (FAL_KEY presente) ou Rota B.
- Se o tema não foi fornecido pelo usuário, pergunte qual é.

### Fase 2: Planejamento (Apresentação ao Cliente)
Desenvolva a copy seguindo os frameworks do Instagram.
Baseado na sua Rota (A ou B), planeje como será o visual de cada slide.

**Se Rota A:** Planeje "slide sim, slide não" de imagens. Escreva o prompt de fotografia (em inglês, cinematic, sem forçar textos) apenas para os slides que terão imagem.
**Se Rota B:** Planeje todos os slides focados em tipografia e impacto geométrico.

Apresente o seu rascunho de Direção de Arte para o usuário aprovar:
```
**Slide 1**
[Se Rota A, mostre o Prompt da Foto].
Copy: [texto]

**Slide 2**
Layout: Tipográfico/Respiro
Copy: [texto]
```
Pergunte: "O que achou da narrativa e da direção de arte? Posso prosseguir para a produção?" Aguarde a resposta.

### Fase 3: Produção de Ativos (APENAS ROTA A)
Se você estiver na Rota A, as imagens planejadas precisam existir antes do código HTML.
1. Crie o arquivo `output/temp/carrossel-[tema]/prompts.json` contendo os prompts planejados na Fase 2.
2. Rode o comando no terminal:
   `node scripts/gerar-imagens-carrossel.js output/temp/carrossel-[tema]/prompts.json output/carrossel-[tema]/images`
3. Acompanhe a execução no terminal. Só avance para a Fase 4 quando tiver certeza de que os arquivos `.png` estão salvos fisicamente.

*Se você estiver na Rota B, pule esta fase inteira.*

### Fase 4: Codificação (HTML Self-Contained)
Agora você vai materializar a Direção de Arte em código, criando um HTML 1080x1350 para cada slide na pasta `output/carrossel-[tema]/`.

**Se o slide exige uma Foto (Rota A):**
O HTML deve abraçar a foto (`./images/slide-XX.png`).
- Ou o Hero Fade (Foto cover com `<div class="overlay">` de gradiente dark no bottom para leitura).
- Ou Split (Foto de um lado, fundo sólido do outro).
*Aviso Estético:* Não suje a fotografia com SVGs ou glows da marca. A foto é suficiente.

**Se o slide é Tipográfico (Rota B ou "Respiro"):**
O HTML deve criar riqueza visual apenas com CSS e formas.
- Use a cor de fundo da marca.
- Crie focos de luz (radial-gradient) atrás de títulos importantes.
- Use linhas de acento (border-left), texturas sutis CSS e ícones SVG minimalistas (Stripe-style).

*Nota Final do Slide:* Verifique se `marca/foto.*` existe. Se sim, injete `__FOTO_PERFIL__` no HTML do último slide (o renderizador cuida do resto).

### Fase 5: Entrega (Puppeteer)
Com os HTMLs e Imagens(se Rota A) salvos na pasta final, transforme o código em arte.
Para cada slide criado, rode:
`node scripts/renderizar.js output/carrossel-[tema]/slide-0[N].html output/carrossel-[tema]/slide-0[N].png`

Por fim, pergunte ao cliente se ele deseja que você envie os PNGs finais via Telegram (caso a chave exista no `.env`).
