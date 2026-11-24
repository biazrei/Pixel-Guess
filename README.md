#  Pixel Guess

> Jogo Web Responsivo (Desktop e Mobile) de adivinhação de imagens, onde o jogador descobre uma imagem secreta revelando-a aos poucos ou remontando um quebra-cabeça. Quanto menos ajuda for utilizada, mais pontos se ganha. 

### Contexto acadêmico

- **Curso:** Engenharia de Software
- **Instituição:** Universidade São Judas Tadeu
- **Disciplina:** Usabilidade, Desenvolvimento Web, Mobile e Jogos
- **Professor:** José Carmino Gomes Junior

###  Modos de Jogo

#### IMAGEM DO DIA: 
- Uma imagem que troca diariamente, igual para todos os jogadores e que é coberta por 16 cards que o jogador revela até acertar, sendo o primeiro card grátis. Do segundo em diante **cada card custa 100 pontos**.
- O jogador começa com **1500** pontos, e esse diminui a cada revelação extra. 

#### SEQUÊNCIA: 
- Três etapas consecutivas, com fase 1, 2 e 3.
- Cada etapa tem uma imagem própria, um **quebra-cabeça de 16 peças embaralhadas**, um **cronômetro** e um sistema de pontuação.
- Para mover as peças, o jogador seleciona **duas peças para trocá-las de lugar**. Não há limite de movimentos.
- A etapa termina quando o **tempo esgota** ou quando o jogador **verifica a resposta** (terminou ou desistiu).

#### MULTIPLAYER: 
- Partidas que funcionam com a criação de uma sala, entrando em uma com código ou em modo aleatório. Com sincronização em tempo real entre os jogadores.


### Diferencial do projeto

- Imagem diária global, que gera um desafio compartilhado entre os jogadores.
- Pontuação baseada em decisão: o jogador escolhe quanto "pagar" por cada pista.
- Interface responsiva (desktop e mobile).
- Hospedagem e banco de dados gratuitos, sem custo para rodar.


##  Tecnologias utilizadas

### Frontend
- React
- TypeScript
- Vite (servidor de desenvolvimento e build)
- React Router (navegação entre telas)
- Lucide React (ícones)
- ESLint (padronização e revisão do código)

### Backend
- Node.js
- Express (API)
- TypeScript (executado com `tsx`)
- CORS (comunicação entre frontend e backend)

### Banco de dados
- SQLite (biblioteca `better-sqlite3`)

### Ferramentas
- Git e GitHub (controle de versão e colaboração)
- VS Code
- npm (gerenciador de pacotes)


##  Pré-requisitos

Para executar o projeto, é preciso ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada) e o **npm** que vem junto
- [Git](https://git-scm.com/)
- Um navegador atualizado
- VS Code

> **Não é necessário instalar o SQLite separadamente.** A biblioteca `better-sqlite3` já traz o SQLite embutido e é instalada junto com o `npm install`.

## Estrutura de Pastas

```
Pixel-Guess/
├── backend/
│ ├── imagens/
│ │ ├── imgdia/ # Imagens do modo Imagem do Dia
│ │ └── imgseq/ # Imagens do modo Sequência
│ ├── src/
│ │ ├── data/
│ │ │ └── pixelguess.db # Banco SQLite (criado automaticamente)
│ │ ├── database/
│ │ │ └── database.ts # Conexão e criação das tabelas
│ │ ├── routes/
│ │ │ ├── imgdiaroutes.ts # Rotas da Imagem do Dia
│ │ │ └── seqroutes.ts # Rotas da Sequência
│ │ ├── seeds/
│ │ │ ├── imgdia.ts # Cadastro das imagens da Imagem do Dia
│ │ │ └── sequencia.ts # Cadastro das imagens e sequências
│ │ ├── services/
│ │ │ ├── imgDiafuncionamento.ts # Escolha da imagem do dia
│ │ │ └── seqfuncionamento.ts # Escolha da sequência do dia
│ │ └── server.ts # Inicia o servidor (porta 3000)
│ ├── package.json
│ ├── package-lock.json
│ └── tsconfig.json
│
├── pixelguess/ # Frontend (React + Vite)
│ ├── public/
│ │ ├── favicon.svg
│ │ └── icons.svg
│ ├── src/
│ │ ├── assets/ # Imagens do frontend
│ │ ├── components/ # Cada pasta tem um .tsx e um .css
│ │ │ ├── Button/ # Botão
│ │ │ ├── CardGrid/ # Grade de 16 cards
│ │ │ ├── GameContainer/ # Imagem desfocada com os cards por cima
│ │ │ ├── Input/ # Campo de resposta
│ │ │ ├── Puzzle/ # Quebra-cabeça de 16 peças
│ │ │ ├── Subtitle/ # Subtítulo
│ │ │ ├── Text/ # Texto
│ │ │ └── Title/ # Título
│ │ ├── pages/
│ │ │ ├── Home/ # Tela inicial (Home.tsx e Home.css)
│ │ │ ├── Imagem do dia/
│ │ │ │ ├── jogo/
│ │ │ │ │ └── JogoDia.tsx # Lógica do jogo (cards e pontos)
│ │ │ │ ├── service/
│ │ │ │ │ └── ImgDiaService.ts # Chamadas à API
│ │ │ │ ├── Imgdia.tsx # Tela do modo
│ │ │ │ └── Imgdia.css
│ │ │ ├── Sequencia/
│ │ │ │ ├── Jogo/
│ │ │ │ │ └── JogoSeq.tsx # Lógica do jogo (etapas e pontos)
│ │ │ │ ├── Service/
│ │ │ │ │ └── SeqService.ts # Chamadas à API
│ │ │ │ ├── Sequencia.tsx # Tela do modo
│ │ │ │ └── Sequencia.css
│ │ │ └── Multiplayer/ # Cada tela tem um .tsx e um .css
│ │ │ ├── Multiplayer.* # Tela principal
│ │ │ ├── Modo.* # Escolha do modo
│ │ │ ├── Criar-sala.* # Criar sala
│ │ │ ├── EntrarSala.* # Entrar em sala
│ │ │ ├── Modo-aleatorio.* # Partida aleatória
│ │ │ └── Vencedor.* # Tela de vencedor
│ │ ├── styles/
│ │ │ ├── global.css # Estilos gerais
│ │ │ └── variables.css # Cores e fontes
│ │ ├── App.tsx # Rotas do frontend
│ │ └── main.tsx # Ponto de entrada do React
│ ├── index.html
│ ├── eslint.config.js
│ ├── vite.config.ts
│ ├── package.json
│ ├── package-lock.json
│ ├── tsconfig.json
│ ├── tsconfig.app.json
│ └── tsconfig.node.json
│
├── .gitignore
└── README.md
```

## Como Executar

```bash
# 1. Clonar o repositório
git clone https://github.com/biazrei/Pixel-Guess.git
cd Pixel-Guess

# 2. Backend (http://localhost:3000)
cd backend
npm install
npm run dev

# 3. Frontend, em outro terminal (http://localhost:5173)
cd pixelguess
npm install
npm run dev
```

## Banco de Dados (SQLite)

- **Banco utilizado:** SQLite (biblioteca `better-sqlite3`), um banco em arquivo, sem servidor próprio.
- **Onde fica:** no arquivo `backend/src/data/pixelguess.db`. A pasta é criada automaticamente.
- **Inicialização:** o `backend/src/database/database.ts` abre a conexão e cria as tabelas na primeira execução do servidor (`CREATE TABLE IF NOT EXISTS`):
  - `imagem_do_dia`: imagens do modo Imagem do Dia (nome e caminho);
  - `imagens_sequencia`: imagens do modo Sequência (nome e caminho);
  - `sequencia_diaria`: conjunto de 3 imagens da Sequência, ligadas à tabela `imagens_sequencia`.
- **Dados iniciais:** as imagens são cadastradas pelos arquivos de `backend/src/seeds/` (`imgdia.ts` e `sequencia.ts`) quando o servidor inicia.
- **Configuração manual:** nenhuma além do `npm install`.

##  Integrantes

| Nome | GitHub |
|------|--------|
| Beatriz Rei Ribeiro | [@biazrei](https://github.com/biazrei) |
| Gabrielle Rodrigues de Alencar | — |
| Julia Leão de Oliveira | [@JuliaL3o](https://github.com/JuliaL3o) |
| Melissa Oliveira Dias | [@mxldias](https://github.com/mxldias) |
| Pietro Silva Soares | [@PietroSoaress](https://github.com/PietroSoaress) |
