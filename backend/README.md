
 # Post Service – Tech Challenge Fase 02

API REST para gerenciamento de postagens (CRUD + busca), desenvolvida em Node.js com TypeScript, Prisma e Docker.

## Tecnologias
- Node.js
- TypeScript
- Express
- Prisma ORM
- Docker e Docker Compose
- Jest (testes)
- GitHub Actions (CI)

## Como executar o projeto

### Usando Docker (recomendado)
1. Clone o repositório
2. Crie um arquivo .env baseado no .env.example
3. Execute:

docker compose up --build

## A API ficará disponível em:
http://localhost:3000

### Executando localmente (sem Docker)
1. npm install
2. npx prisma generate
3. npx prisma migrate dev
4. npm run dev

## Endpoints
GET /posts – Lista todas as postagens
GET /posts/:id – Retorna uma postagem pelo ID
POST /posts – Cria uma nova postagem
PUT /posts/:id – Atualiza uma postagem existente
DELETE /posts/:id – Remove uma postagem
GET /posts/search – Busca postagens por palavra-chave

## Testes
npm test
npm run test:coverage

## Variáveis de ambiente
O projeto utiliza variáveis de ambiente para configuração.
Crie um arquivo .env baseado no .env.example localizado na raiz do projeto.

## Observações
Projeto desenvolvido como parte do Tech Challenge – Fase 02 da Pós Tech em Full Stack Development.

