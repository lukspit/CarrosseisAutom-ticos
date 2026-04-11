# Carousel Engine

Gera carrosséis profissionais para o Instagram com a sua identidade visual — direto no Claude Code, sem ferramentas de design, sem assinatura de software.

Você conversa, o sistema gera os slides em PNG prontos para postar. Se quiser, entrega automático no Telegram.

---

## O que você recebe

- Sistema completo de geração de carrosséis dentro do Claude Code
- Framework de copy baseado em pesquisa real de carrosséis de alto engajamento no Instagram
- Identidade visual da sua marca aplicada automaticamente em cada carrossel
- Slides renderizados em PNG 1080x1350 (formato nativo 4:5 do Instagram)
- Entrega opcional direto no Telegram

---

## Pré-requisitos

- [Claude Code](https://claude.ai/code) instalado (extensão do VS Code ou app)
- Assinatura ativa da Anthropic (plano Pro ou acima)
- [Node.js](https://nodejs.org) instalado (versão 18 ou superior)

---

## Como começar

**1.** Clone o repositório

```bash
git clone https://github.com/lukspit/CarrosseisAutom-ticos.git
```

**2.** Abra a pasta no Claude Code

**3.** Digite `/chef` e siga as instruções

O setup leva cerca de 10 minutos na primeira vez — o sistema instala as dependências, pesquisa padrões reais do Instagram, configura a identidade da sua marca, e já gera o primeiro carrossel de teste.

Depois do setup, é só pedir: *"cria um carrossel sobre produtividade"* — e receber os slides prontos.

---

## Comandos

| Comando | O que faz |
|---|---|
| `/chef` | Setup inicial ou retomada. Use sempre que abrir em uma nova máquina. |
| `/carrossel [tema]` | Gera um carrossel. Ex: `/carrossel marketing digital` |
| `/marca` | Atualiza cores, fonte, tom de voz ou nicho da sua marca |
| `/entregar` | Envia o carrossel mais recente para o Telegram |

---

## Estrutura do projeto

```
carousel-engine/
├── CLAUDE.md                    ← Instruções do sistema (lidas automaticamente)
├── .claude/commands/            ← Comandos /chef, /carrossel, /marca, /entregar
├── scripts/
│   ├── renderizar.js            ← Converte HTML em PNG via Puppeteer
│   └── entregar.js              ← Envia slides para o Telegram
├── marca/                       ← Perfil e tokens visuais da sua marca (preenchidos no setup)
├── pesquisa/                    ← Framework de carrosséis baseado em pesquisa real do Instagram
├── output/                      ← Slides gerados em PNG
└── config/.env.example          ← Modelo de credenciais do Telegram
```

---

## Perguntas frequentes

**Precisa saber programar?**
Não. Tudo é feito conversando com o Claude. O único comando que você digita é `/chef` na primeira vez.

**Funciona no Windows?**
Sim. O sistema detecta automaticamente o sistema operacional e instala o Puppeteer da forma correta para cada plataforma (Mac Intel, Mac Apple Silicon, Windows, Linux).

**O Telegram é obrigatório?**
Não. Se preferir, os slides ficam salvos na pasta `output/` do projeto. O Telegram é recomendado porque facilita muito o fluxo — o carrossel chega no celular assim que fica pronto.

**Quantos slides por carrossel?**
Entre 5 e 10, dependendo do tema. O sistema decide com base no conteúdo e nos padrões de engajamento pesquisados.
