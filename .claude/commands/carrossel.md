# /carrossel — Geração de Carrossel

Gera um carrossel completo para Instagram: copy, design HTML, geração de imagens via IA (Fal.ai/Pollinations) e renderização PNG.

Pode ser chamado com tema: `/carrossel produtividade`
Ou sem tema: `/carrossel` (Claude pergunta)

---

## Pré-condições — verifique antes de tudo

Antes de qualquer geração:

1. `marca/perfil.md` existe e tem conteúdo? → Leia o arquivo
2. `marca/sistema-visual.css` tem variáveis CSS? → Leia o arquivo
3. `pesquisa/instagram-framework.md` tem conteúdo? → Leia o arquivo
4. `node_modules/` existe? → `ls node_modules 2>/dev/null | head -3`

Se algum desses estiver faltando, informe o que falta e ofereça fazer o setup: "Antes de criar o carrossel, precisamos configurar [o que faltou]. Isso leva 10 minutos. Pode ser agora?"

---

## Sequência de geração

### Passo 1 — Leitura obrigatória

Leia silenciosamente:
- `AGENTS.md` (Absorva 100% as regras da seção de "Arquitetura de Layouts" e "Slides COM Imagem" vs "SEM Imagem")
- `marca/perfil.md`
- `marca/sistema-visual.css`
- `pesquisa/instagram-framework.md`

Verifique: `ls marca/foto.* 2>/dev/null` — existe foto de perfil? Guarde esse estado para usar no slide final.

### Passo 2 — Confirmação do tema e objetivo

Se o tema não foi passado, pergunte:
> "Qual o tema do carrossel? E o objetivo principal: educar, gerar autoridade, ou converter?"

Se já foi passado, apenas confirme o objetivo com 1 pergunta.
Aguarde a resposta.

### Passo 3 — Geração de Copy e Planejamento de Layout (interno)

Crie o copy completo e, **OBRIGATORIAMENTE**, defina qual dos 4 Layouts Visuais (descritos no AGENTS.md) cada slide vai usar.
**REGRA DE OURO:** "Slide sim, slide não". Não coloque imagens em todos os slides. Um carrossel de 7 slides deve ter no máximo 3 ou 4 imagens. O restante DEVE ser "Minimalista" (só texto).

- **Slide 1 (hook):** Layout Obrigatório: `Hero Fade`. (Requer prompt de IA).
- **Slides do meio:** Intercale. Exemplo: S2 Minimalista, S3 Split Lateral, S4 Minimalista, S5 Split Horizontal...
- **Slide final (CTA):** Normalmente `Minimalista` para focar na conversão.

### Passo 4 — Apresentação para aprovação

Apresente o resultado pro usuário aprovar nestes moldes exatos:

```
**Slide 1 (Hook)**
- Layout: Hero Fade
- Prompt IA: [Seu prompt em inglês, hiper-realista, cinematic, etc. Sem pedir textos na imagem]
- Copy: [texto do slide]

**Slide 2**
- Layout: Minimalista (Sem imagem)
- Copy: [texto do slide]

**Slide 3**
- Layout: Split Lateral
- Prompt IA: [Seu prompt em inglês]
- Copy: [texto do slide]
```

Após apresentar, pergunte: "O copy e as ideias de imagens estão boas? Quer mudar algo antes de eu gerar o código e os fundos?"
Aguarde aprovação ou ajuste.

### Passo 5 — Geração do JSON de Prompts

Crie um arquivo JSON com os prompts apenas para os slides que usarão imagem.
Salve em: `output/temp/carrossel-[tema-slug]/prompts.json`

```json
[
  { "nomeArquivo": "slide-01.png", "prompt": "..." },
  { "nomeArquivo": "slide-03.png", "prompt": "..." }
]
```

### Passo 6 — Download das Imagens

Rode o script que baixa as imagens (usando a Fal.ai ou o fallback):
`node scripts/gerar-imagens-carrossel.js output/temp/carrossel-[tema-slug]/prompts.json output/carrossel-[tema-slug]/images`

Aguarde o comando terminar. Informe o usuário se ocorreu algum erro. Se der erro, pergunte o que ele prefere fazer antes de gerar o HTML.

### Passo 7 — Geração de HTML

Crie o HTML de cada slide e salve DIRETAMENTE em `output/carrossel-[tema-slug]/slide-0[N].html`.

**REGRAS CRÍTICAS DE DESIGN:**
- Você é obrigado a codificar o HTML de acordo com o Layout definido no Passo 4.
- **Se for Hero Fade ou Split:** Use a tag `<img src="./images/slide-0X.png">` ou `background-image: url('./images/slide-0X.png')`. **É PROIBIDO** colocar Glow, texturas pontilhadas ou SVGs abstratos por cima. A foto gerada pela IA e o fundo de contraste são suficientes.
- **Se for Minimalista:** NÃO cite arquivos na pasta `/images`. O slide deve ser 100% focado no CSS da marca, usando cores de fundo sólidas, adicionando Glows no texto, linhas de detalhe, SVGs minimalistas (Stripe-style).

*Dica Técnica:* O tamanho do carrossel é cravado em 1080x1350. Sem barra de rolagem. As fontes devem ser importadas via CDN e referenciadas em `--fonte-principal`. Use `__FOTO_PERFIL__` no último slide.

### Passo 8 — Renderização via Puppeteer

Transforme os HTMLs em PNG rodando (para cada slide):
`node scripts/renderizar.js output/carrossel-[tema-slug]/slide-0[N].html output/carrossel-[tema-slug]/slide-0[N].png`

Avise o usuário que está renderizando.

### Passo 9 — Entrega

Ao final, se o `.env` possuir credenciais do Telegram (TELEGRAM_TOKEN preenchido), pergunte:
> "Os [N] slides foram gerados em `output/carrossel-[tema]/`. Quer que eu envie direto para o seu Telegram agora?"

Se o Telegram não estiver configurado, apenas confirme o sucesso na pasta local.
