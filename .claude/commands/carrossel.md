# /carrossel — Geração de Carrossel

Gera um carrossel completo para Instagram: copy, design HTML, renderização PNG.

Pode ser chamado com tema: `/carrossel produtividade`
Ou sem tema: `/carrossel` (Claude pergunta)

---

## Pré-condições — verifique antes de tudo

Antes de qualquer geração:

1. `marca/perfil.md` existe e tem conteúdo? → Leia o arquivo
2. `marca/sistema-visual.css` tem variáveis CSS? → Leia o arquivo
3. `pesquisa/instagram-framework.md` tem conteúdo? → Leia o arquivo
4. `node_modules/` existe? → `ls node_modules 2>/dev/null | head -3`

Se algum desses estiver faltando, não gere o carrossel ainda. Informe o que falta e ofereça fazer o setup: "Antes de criar o carrossel, precisamos configurar [o que faltou]. Isso leva [estimativa]. Pode ser agora?"

---

## Sequência de geração

### Passo 1 — Leitura obrigatória

Leia silenciosamente (sem dizer ao usuário que está lendo):
- `marca/perfil.md`
- `marca/sistema-visual.css`
- `pesquisa/instagram-framework.md`

Absorva: identidade da marca, tokens visuais, o que funciona no Instagram.

### Passo 2 — Confirmação do tema e objetivo

Se o tema foi passado no comando, apenas confirme o objetivo:
> "Vou criar um carrossel sobre [tema] para [público-alvo do perfil da marca]. Qual o objetivo principal: educar, gerar autoridade, ou converter?"

Se o tema não foi passado:
> "Qual o tema do carrossel? E o objetivo principal: educar, gerar autoridade, ou converter?"

Aguarde a resposta. Isso é máximo de uma mensagem — não faça mais perguntas antes de gerar.

### Passo 3 — Geração de copy (interno, não mostre ainda)

Crie o copy completo de todos os slides seguindo os princípios do CLAUDE.md:

- **Slide 1 (hook):** Para o scroll. Gap de curiosidade, afirmação ousada, dor específica, ou número concreto. Nunca "Você sabia que...". Baseie nos padrões do `instagram-framework.md`.
- **Slides do meio (2 a N-1):** Cada um cria desejo pelo próximo. Cliff-hangers, revelações, progressão lógica com tensão. Quantidade: entre 4 e 7 slides do meio, dependendo do tema.
- **Slide final:** Uma única CTA. Direta. Sem rodeios. Use a CTA preferida do perfil da marca se existir.

Número total de slides: mínimo 5, máximo 9.

### Passo 4 — Apresentação do copy para aprovação

Mostre o copy assim:

```
**Slide 1 (hook)**
[texto do slide 1]

**Slide 2**
[texto]

**Slide 3**
[texto]

...

**Slide [N] (CTA)**
[texto]
```

Depois:
> "O copy está bom? Quer ajustar algum slide antes de eu renderizar? (pode pedir mudanças específicas ou aprovar tudo)"

Aguarde resposta. Faça os ajustes pedidos e re-apresente apenas os slides alterados. Não re-apresente o carrossel inteiro se só 1 slide mudou.

### Passo 5 — Geração de HTML

Para cada slide, gere um arquivo HTML completo e self-contained.

**Regras de geração:**

- Cada HTML funciona sozinho — sem imports externos além de Google Fonts
- Viewport: `<meta name="viewport" content="width=1080">`
- CSS inline dentro de `<style>` no `<head>`
- Use as variáveis CSS de `marca/sistema-visual.css` como valores diretos (copie os valores — não faça import do arquivo externo)
- Tipografia: import Google Fonts via CDN com fallback obrigatório
- Layout: composição nova para este carrossel, baseada nos padrões de `instagram-framework.md`
- Dimensão do conteúdo: todo o conteúdo deve caber em 1080x1350 sem scroll
- Texto: mínimo necessário. Se precisar de mais de 3 linhas densas, corte

**Estrutura base de cada HTML:**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <title>Slide [N]</title>
  <link href="https://fonts.googleapis.com/css2?family=NOME:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      background-color: COR_FUNDO;
      font-family: 'NOME', system-ui, sans-serif;
      color: COR_TEXTO;
    }
    
    /* Layout específico deste slide */
    [...]
  </style>
</head>
<body>
  [conteúdo do slide]
</body>
</html>
```

Salve cada HTML em `output/temp/carrossel-[tema-slug]/slide-0[N].html`.

### Passo 6 — Renderização

Para cada slide, execute:

```
node scripts/renderizar.js output/temp/carrossel-[tema]/slide-0[N].html output/carrossel-[tema]/slide-0[N].png
```

Reporte progresso ao usuário: "Renderizando slide 2/6..." (não rode em silêncio total — o usuário precisa saber que está acontecendo).

Se um slide falhar ao renderizar, informe qual foi e tente novamente antes de reportar o erro.

Após todos os slides:

> "Carrossel gerado em `output/carrossel-[tema]/` — [N] slides prontos."

### Passo 7 — Entrega

Se `config/.env` existe (Telegram configurado):
> "Quer que eu envie para o Telegram agora?"

Se não:
> "Os slides estão em `output/carrossel-[tema]/`. Quer configurar o envio automático para o Telegram? É rápido de fazer."

---

## Notas de design para diferentes objetivos

**Educar:** Layout mais estruturado. Progressão clara (1 → 2 → 3...). Bom para conteúdo de "passo a passo" ou "guia". Slide final: "Salva esse post para não perder."

**Gerar autoridade:** Tom mais assertivo. Afirmações fortes. Dados e especificidade são cruciais. Slide final: Convida a seguir ou a ver mais conteúdo.

**Converter:** Foco em uma transformação ou resultado específico. CTA mais direta — link, DM, inscrição. Slide final deve criar urgência ou clareza de benefício.

Adapte layout e tipografia ao objetivo — não há uma fórmula visual única.
