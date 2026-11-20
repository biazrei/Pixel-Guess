#  Pixel Guess

> Jogo web de adivinhação de imagens reveladas aos poucos, com quebra-cabeça cronometrado e pontuação.

##  Sobre o projeto

**Pixel Guess** é um jogo de adivinhação visual em que os jogadores precisam descobrir o que está escondido por trás de uma imagem, desbloqueando pistas e fragmentos a cada tentativa. Quanto menos ajuda o jogador usa, mais pontos ele ganha.

### Objetivo principal

Desenvolver uma aplicação web completa (frontend + backend + banco de dados) com jogos de imagem, pontuação e validação de respostas, funcionando em desktop e mobile.

### Contexto acadêmico

- **Curso:** Engenharia de Software
- **Instituição:** Universidade São Judas Tadeu
- **Disciplina:** Usabilidade, Desenvolvimento Web, Mobile e Jogos
- **Professor:** José Carmino Gomes Junior

##  O que é o Pixel Guess?

É um jogo de imagens com três modos: Imagem do Dia, Sequência e Multiplayer. A imagem fica escondida atrás de cards ou embaralhada em peças, e o jogador decide quanta ajuda quer usar.

### Qual problema ou proposta ele aborda?

A proposta é criar uma experiência de jogo curta e diária, que treina observação e raciocínio visual. O projeto também exercita, na prática, a comunicação entre frontend e backend, o uso de banco de dados e a aplicação de regras de negócio (pontuação e validação) no servidor, com foco em usabilidade e em funcionar bem em desktop e mobile.

### Dinâmica do jogo

####  Modo Imagem do Dia

- Existe **uma única imagem por dia**, igual para todos os jogadores. Ela é trocada automaticamente à meia-noite.
- A imagem começa coberta por **16 cards**.
- O **primeiro card é grátis**. Do segundo em diante, **cada card revelado custa 100 pontos**.
- O jogador começa com **1500 pontos** possíveis, e esse total diminui a cada revelação extra.
- Ao abrir o último card (os 16), o jogador tem **uma única tentativa final** para digitar a resposta. Se errar, o desafio termina **sem pontuação**.

####  Modo Sequência

- São **3 etapas consecutivas**. A variável `etapa` indica a fase atual (1, 2 ou 3).
- Cada etapa tem uma imagem própria, um **quebra-cabeça de 16 peças embaralhadas**, um **cronômetro** e um sistema de pontuação.
- Para mover as peças, o jogador seleciona **duas peças para trocá-las de lugar**. Não há limite de movimentos.
- A etapa termina quando o **tempo esgota** ou quando o jogador **verifica a resposta** (terminou ou desistiu).
- Os pontos só são contabilizados quando a etapa termina: **cada peça no lugar vale 50 pontos**.
- Ao final, o jogador vê a **pontuação da etapa** e a **pontuação total** (soma de todas as etapas). A próxima etapa só começa quando o jogador clica no botão de avançar.

####  Modo Multiplayer

Permite jogar com outras pessoas criando uma sala ou entrando em uma, ou no modo aleatório. A tela de vencedor mostra o resultado da partida. Nesta versão o multiplayer **ainda não funciona em tempo real** (sem sincronização instantânea entre os jogadores).

> Ranking e login de usuários não fazem parte do escopo final do projeto.

### Diferencial do projeto

- Imagem diária global, que gera um desafio compartilhado entre os jogadores.
- Dois estilos de jogo no mesmo projeto: revelar cards (dedução) e quebra-cabeça (habilidade e tempo).
- Pontuação baseada em decisão: o jogador escolhe quanto "pagar" por cada pista.
- Interface responsiva (desktop e mobile).
- Hospedagem e banco de dados gratuitos, sem custo para rodar.

##  Funcionalidades implementadas

- [x] Estrutura do projeto organizada (frontend e backend separados)
- [x] Backend com rotas, serviços (regras do jogo) e seeds para os modos Imagem do Dia e Sequência
- [x] Banco de dados SQLite configurado no backend, com seeds para popular as imagens
- [x] Modo Imagem do Dia (tela do jogo + serviço de comunicação com o backend)
- [x] Modo Sequência (3 etapas, quebra-cabeça de 16 peças, troca de peças, pontuação)
- [x] Modo Multiplayer (criar sala, entrar na sala, modo aleatório e tela de vencedor), sem tempo real por enquanto
- [x] Tela inicial (Home)
- [x] Organização e renomeação das imagens no backend
- [x] Estilos globais e variáveis de tema (`styles/`)
- [ ] Pontuação salva no banco 
- [ ] Validação das respostas
- [x] Troca automática da imagem diária à meia-noite
- [ ] Multiplayer em tempo real (não implementado nesta versão)

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
- dotenv (variáveis de ambiente)

### Banco de dados
- SQLite (biblioteca `better-sqlite3`)

### Ferramentas
- Git e GitHub (controle de versão e colaboração)
- VS Code
- npm (gerenciador de pacotes)

##  Estrutura de pastas

```
Pixel-Guess/
├── backend/
│ ├── imagens/ # Imagens usadas nos jogos
│ ├── src/
│ │ ├── data/
│ │ │ └── pixelguess.db # Arquivo do banco (criado automaticamente)
│ │ ├── database/
│ │ │ └── database.ts # Conexão e criação das tabelas SQLite
│ │ ├── routes/
│ │ │ ├── imgdiaroutes.ts # Rotas do modo Imagem do Dia
│ │ │ └── seqroutes.ts # Rotas do modo Sequência
│ │ ├── seeds/
│ │ │ ├── imgdia.ts # Dados iniciais da Imagem do Dia
│ │ │ └── sequencia.ts # Dados iniciais da Sequência
│ │ ├── services/
│ │ │ ├── imgDiafuncionamento.ts # Regras do modo Imagem do Dia
│ │ │ └── seqfuncionamento.ts # Regras do modo Sequência
│ │ └── server.ts # Ponto de entrada do servidor
│ ├── package.json
│ ├── package-lock.json
│ └── tsconfig.json
│
├── pixelguess/ # Frontend (React + Vite)
│ ├── public/ # favicon.svg, icons.svg
│ ├── src/
│ │ ├── assets/ # Imagens do front (ex.: gato.jpeg)
│ │ ├── components/ # Componentes reutilizáveis
│ │ ├── pages/
│ │ │ ├── Home/ # Tela inicial
│ │ │ ├── Imagem do dia/ # Jogo, serviço e tela do modo Imagem do Dia
│ │ │ ├── Multiplayer/ # Criar sala, entrar na sala, modo aleatório, vencedor
│ │ │ └── Sequencia/ # Tela do modo Sequência
│ │ ├── styles/ # global.css e variables.css
│ │ ├── App.tsx
│ │ └── main.tsx
│ ├── index.html
│ ├── eslint.config.js
│ ├── package.json
│ ├── package-lock.json
│ ├── tsconfig.json
│ ├── tsconfig.app.json
│ ├── tsconfig.node.json
│ └── vite.config.ts
│
├── .gitignore
└── README.md
```

##  Pré-requisitos

Para executar o projeto, é preciso ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada) e o **npm** que vem junto
- [Git](https://git-scm.com/)
- Um navegador atualizado
- (Opcional) VS Code

> **Não é necessário instalar o SQLite separadamente.** A biblioteca `better-sqlite3` já traz o SQLite embutido e é instalada junto com o `npm install`.

##  Como executar

```bash
# 1. Clonar o repositório
git clone https://github.com/biazrei/Pixel-Guess.git
cd Pixel-Guess

# 2. Backend
cd backend
npm install
npm run dev
# servidor em http://localhost:[PORTA]

# 3. Frontend (em outro terminal)
cd pixelguess
npm install
npm run dev
# aplicação em http://localhost:5173
```

Outros comandos do frontend: `npm run build` (gera a versão final), `npm run lint` (revisa o código) e `npm run preview` (testa o build).

##  Banco de dados (SQLite)

- **Qual banco é utilizado:** SQLite, um banco relacional **baseado em arquivo**, sem servidor próprio, gratuito e simples de configurar. O acesso é feito com a biblioteca `better-sqlite3`.
- **Onde fica armazenado:** no arquivo `backend/src/data/pixelguess.db`. A pasta `data/` é criada automaticamente se não existir.
- **Como ocorre a inicialização:** o arquivo `backend/src/database/database.ts` abre a conexão e cria as tabelas na primeira execução do servidor (`CREATE TABLE IF NOT EXISTS`):
  - `imagem_do_dia`: imagens do modo Imagem do Dia (nome e caminho);
  - `imagens_sequencia`: imagens do modo Sequência (nome e caminho);
  - `sequencia_diaria`: combinação de 3 imagens da Sequência, ligadas à tabela `imagens_sequencia`.
- **Dados iniciais:** as imagens são cadastradas pelos arquivos de `backend/src/seeds/` (`imgdia.ts` e `sequencia.ts`) 
- **Configuração manual:** nenhuma além do `npm install`. 

##  Integrantes

| Nome | GitHub |
|------|--------|
| Beatriz Rei Ribeiro | [@biazrei](https://github.com/biazrei) |
| Gabrielle Rodrigues de Alencar | — |
| Julia Leão de Oliveira | [@JuliaL3o](https://github.com/JuliaL3o) |
| Melissa Oliveira Dias | [@mxldias](https://github.com/mxldias) |
| Pietro Silva Soares | [@PietroSoaress](https://github.com/PietroSoaress) |
