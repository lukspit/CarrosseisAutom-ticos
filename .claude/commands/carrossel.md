# /carrossel — Linha de Produção Automática

Este comando segue uma sequência lógica de dependências. Você está PROIBIDO de avançar para uma fase sem concluir a anterior e verificar os arquivos no disco.

---

## FASE 1: Setup de Rota (Obrigatório)
1. Use `view_file` para ler `config/.env`.
   - Se `FAL_KEY` tiver valor: **ROTA A (Premium)**.
   - Se estiver vazio: **ROTA B (Tipográfica)**.
2. Leia `AGENTS.md`, `marca/perfil.md` e `pesquisa/instagram-framework.md`.

---

## FASE 2: Planejamento e Copy (Aprovação 1)
1. **Esqueleto Visual:** Defina quantos slides e quais terão fotos (Ex: 1, 3, 5 com imagem, outros respiro).
2. **Prompts e Copy:** Escreva a copy e os prompts de fotografia (em inglês) para os slides escolhidos.
3. **Apresentação:** Mostre ao usuário o planejamento:
   - Slide X: [Layout] | [Copy] | [Prompt se Rota A]
4. **BLOQUEIO:** Pergunte: "Posso gerar as IMAGENS e o planejamento de ativos?" (Não mencione HTML ainda).
   - *Aguarde aprovação.*

---

## FASE 3: Geração de Ativos (Apenas Rota A)
1. Crie o arquivo `output/temp/carrossel-[tema]/prompts.json`.
2. **EXECUÇÃO:** Rode no terminal:
   `node scripts/gerar-imagens-carrossel.js output/temp/carrossel-[tema]/prompts.json output/carrossel-[tema]/images`
3. **VERIFICAÇÃO DE DISCO (CRÍTICO):** Após o script, você DEVE rodar `ls output/carrossel-[tema]/images`.
   - Se a pasta estiver vazia, você ERROU. Tente gerar novamente.
   - Se as imagens estiverem lá, informe ao usuário: "Imagens geradas com sucesso. Vou começar o código agora."

---

## FASE 4: Codificação HTML e Renderização
1. Gere os arquivos HTML em `output/carrossel-[tema]/`.
2. **REGRA DE OURO:** Use os layouts do AGENTS.md. Se o slide tem foto, use a foto. Se é respiro, use tipografia e geometria.
3. Para cada HTML, rode a renderização:
   `node scripts/renderizar.js output/carrossel-[tema]/slide-0X.html output/carrossel-[tema]/slide-0X.png`

---

## FASE 5: Finalização
1. Informe que os PNGs estão prontos.
2. Ofereça o envio via Telegram se configurado.
