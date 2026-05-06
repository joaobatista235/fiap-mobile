# FIAP Blog — Tech Challenge Fase 04

Projeto desenvolvido para a **Pós Tech em Full Stack Development** da FIAP.  
Plataforma de blog educacional com autenticação por perfil, gestão de conteúdo e administração de usuários, composta por uma API REST em Node.js e um aplicativo mobile em React Native.

---

## Sumário

1. [Como Executar o Projeto](#1-como-executar-o-projeto)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Uso da Aplicação](#3-uso-da-aplicação)
4. [Relato de Experiências e Desafios](#4-relato-de-experiências-e-desafios)

---

## 1. Como Executar o Projeto

### Pré-requisitos

| Ferramenta | Versão mínima | Observação |
|------------|---------------|------------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 4.x | Com WSL 2 Integration ativada |
| [Node.js](https://nodejs.org/) | 20.x | Instalado no **Windows** (não no WSL) |
| [Expo Go](https://expo.dev/go) | — | Instalar no celular Android ou iOS |
| WSL 2 | — | Ubuntu ou Debian |

> **Importante:** o celular e o computador devem estar na **mesma rede Wi-Fi**.

---

### 1.1 Clonar o repositório

Abra um terminal **WSL** e execute:

```bash
git clone https://github.com/joaobatista235/fiap-mobile.git
cd fiap-mobile
```

---

### 1.2 Configurar as variáveis de ambiente

O projeto possui dois arquivos `.env`, um para cada serviço. Copie os exemplos e edite conforme seu ambiente:

```bash
cp backend/.env.example backend/.env
cp mobile/.env.example mobile/.env
```

#### `backend/.env`

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postsdb
JWT_SECRET=troque_por_uma_chave_secreta_longa
```

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta em que a API irá escutar. Padrão: `3000`. |
| `NODE_ENV` | Ambiente de execução. Use `development` localmente. |
| `DATABASE_URL` | String de conexão com o PostgreSQL. Em execução via Docker, o host deve ser `localhost` (acesso pelo host) ou `postgres` (dentro da rede Docker). |
| `JWT_SECRET` | Chave secreta para assinar e verificar os tokens JWT. Use uma string longa e aleatória em produção. |

#### `mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000/api
```

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_URL` | URL base da API consumida pelo app. **Não use `localhost`** — o celular não consegue resolver esse endereço. Use o IP da sua máquina na rede Wi-Fi local (ex.: `192.168.1.100`). Para descobrir o IP no Windows, abra o CMD e execute `ipconfig`; procure o endereço IPv4 da interface Wi-Fi. |

> **Como encontrar seu IP:** no CMD do Windows execute `ipconfig` e localize o campo `Endereço IPv4` da sua conexão Wi-Fi ativa.

---

### 1.3 Executar o script de setup

> **Atenção:** o script deve ser executado em um terminal **WSL**, não no PowerShell nem no CMD do Windows. O PowerShell apresenta erros de permissão ao tentar criar arquivos Linux.

```bash
bash setup.sh
```

O script executa automaticamente, em ordem:

| Passo | O que faz |
|-------|-----------|
| **1/6** | `npm install` no backend — via PowerShell (permissões Windows) |
| **2/6** | `npm install` no mobile — via PowerShell (permissões Windows) |
| **3/6** | `docker compose up -d --build` — constrói a imagem e sobe a API, o banco PostgreSQL e o Adminer |
| **4/6** | Aguarda o PostgreSQL aceitar conexões (timeout: 60 s) |
| **5/6** | `prisma migrate deploy` — cria todas as tabelas no banco |
| **6/6** | `prisma/seed.ts` — popula o banco com usuários e posts iniciais |

Ao final, o terminal exibe:

```
  Backend API : http://localhost:3000
  Swagger     : http://localhost:3000/api-docs
  Adminer     : http://localhost:8080

  Login padrão (ADMIN):
    e-mail : admin@admin.com
    senha  : admin
```

---

### 1.4 Iniciar o aplicativo mobile

> ⚠️ **ATENÇÃO — erro comum:** execute este passo **obrigatoriamente no PowerShell ou CMD do Windows**, nunca no terminal WSL (Ubuntu/Debian).  
> Rodar o Metro Bundler via WSL impede que o Expo Go no celular consiga baixar o bundle JavaScript, resultando em erros de conexão como *"Failed to download remote update"* ou *"Something went wrong"* — mesmo que o celular esteja na mesma rede.

Abra o **PowerShell ou CMD do Windows** (não o WSL) dentro da pasta `mobile/` e execute:

```powershell
npx expo start --clear
```

Escaneie o QR code com o **Expo Go** no celular.

**Resumo de qual terminal usar em cada etapa:**

| Etapa | Terminal correto |
|-------|-----------------|
| `git clone` / `cp .env` / `bash setup.sh` / `bash reset.sh` | WSL (Ubuntu) |
| `npx expo start` | PowerShell ou CMD do Windows |

> **Por que essa separação?** O WSL não expõe o Metro Bundler nas interfaces de rede do Windows. O celular tenta se conectar ao IP da máquina Windows — se o Metro estiver rodando no WSL, a porta simplesmente não existe no lado Windows e o download falha.

---

### 1.5 Resetar o ambiente (opcional)

Para apagar containers, volumes (banco de dados) e `node_modules` e começar do zero:

```bash
bash reset.sh
```

Em seguida, rode `bash setup.sh` novamente.

---

## 2. Arquitetura do Sistema

```
fiap-mobile/
├── backend/          # API REST — Node.js + Express + Prisma + PostgreSQL
├── mobile/           # App mobile — React Native + Expo Router
├── setup.sh          # Automação de setup completo
└── reset.sh          # Reset completo do ambiente
```

### Backend

| Camada | Tecnologia | Responsabilidade |
|--------|-----------|-----------------|
| Framework | Express 5 | Roteamento e middleware HTTP |
| ORM | Prisma 6 | Acesso ao banco, migrations e tipagem |
| Banco de dados | PostgreSQL 15 (Docker) | Persistência de dados |
| Autenticação | JWT + bcrypt | Geração e validação de tokens; hash de senhas |
| Validação | Zod 4 | Validação de schemas de entrada |
| Documentação | Swagger (swagger-jsdoc + swagger-ui-express) | Documentação interativa da API em `/api-docs` |
| Infraestrutura | Docker + Docker Compose | Containerização da API, banco e Adminer |

**Fluxo de autenticação:**

```
POST /api/users/login
  → valida email/senha no banco
  → retorna { token (JWT, 1h), user: { id, name, email, role } }
```

O token é enviado em todas as requisições protegidas pelo header:
```
Authorization: Bearer <token>
```

**Modelos de dados:**

```
User
  id        UUID (PK)
  name      String
  email     String (unique)
  password  String (bcrypt)
  role      String  →  "ADMIN" (professor) | "USER" (aluno)
  createdAt DateTime

Post
  id        Int (PK, autoincrement)
  title     String
  content   String
  authorId  UUID? (FK → User)
  createdAt DateTime
  updatedAt DateTime
```

### Mobile

| Camada | Tecnologia | Responsabilidade |
|--------|-----------|-----------------|
| Framework | React Native + Expo SDK 54 | Renderização nativa cross-platform |
| Roteamento | Expo Router 6 | Navegação baseada em sistema de arquivos |
| HTTP Client | Axios | Requisições à API com interceptors de token |
| Armazenamento | expo-secure-store | Persistência segura do token JWT no dispositivo |
| Estado de auth | React Context + hooks | Compartilhamento do estado de autenticação |

**Estrutura de pastas do mobile:**

```
mobile/
├── app/                    # Rotas (Expo Router — baseado em arquivos)
│   ├── _layout.tsx         # Layout raiz: AuthProvider + Guard de autenticação
│   ├── (auth)/             # Grupo de rotas públicas
│   │   └── login.tsx
│   └── (app)/              # Grupo de rotas protegidas
│       ├── index.tsx        # Lista de posts
│       ├── post/            # CRUD de posts
│       ├── teachers/        # CRUD de professores
│       ├── students/        # CRUD de alunos
│       └── admin/           # Tela administrativa
└── src/
    ├── api/                 # Serviços HTTP (posts, users, auth)
    ├── contexts/            # AuthContext
    ├── hooks/               # useAuth, usePosts, useTeachers, useStudents
    ├── screens/             # Componentes de tela
    ├── components/          # Componentes reutilizáveis
    ├── storage/             # token.ts — persistência com SecureStore
    └── types/               # Tipos TypeScript globais
```

**Guard de autenticação:**

O componente `Guard` no layout raiz monitora `isAuthenticated` e `isLoading`. Enquanto a sessão é restaurada do SecureStore (ao abrir o app), a Splash Screen permanece visível. Após a restauração, usuários não autenticados são redirecionados automaticamente para o login.

---

## 3. Uso da Aplicação

### Perfis de acesso

| Perfil | Role | Credenciais padrão |
|--------|------|--------------------|
| Administrador | `ADMIN` | `admin@admin.com` / `admin` |
| Professor | `ADMIN` | `carlos@fiap.com.br` / `fiap123` |
| Aluno | `USER` | `leticia@aluno.fiap.com` / `fiap123` |

> Professores e o Admin compartilham o mesmo `role = ADMIN`. A diferença é apenas semântica — ambos têm acesso total às funcionalidades de gestão.

### Funcionalidades por perfil

| Funcionalidade | Aluno (USER) | Professor/Admin (ADMIN) |
|---------------|:---:|:---:|
| Visualizar lista de posts | ✔ | ✔ |
| Buscar posts | ✔ | ✔ |
| Ler post completo | ✔ | ✔ |
| Criar post | — | ✔ |
| Editar post | — | ✔ |
| Excluir post | — | ✔ |
| Gerenciar professores | — | ✔ |
| Gerenciar alunos | — | ✔ |
| Tela admin (gestão rápida de posts) | — | ✔ |

### Navegação

- **Lista de posts** → tela inicial após login
- **Detalhe do post** → toque em qualquer card
- **Criar post** → botão `+` (FAB) na lista (apenas ADMIN)
- **Editar/Excluir post** → botões no detalhe do post (apenas ADMIN)
- **Professores / Alunos / Admin** → botões no cabeçalho da lista (apenas ADMIN)

---

## 4. Relato de Experiências e Desafios

### Ambiente Windows + WSL2 + Docker

O principal desafio técnico do projeto foi a gestão do ambiente de desenvolvimento em Windows com WSL2. O filesystem compartilhado entre Windows e Linux (`/mnt/c/`) impõe restrições de permissão que causaram uma série de problemas encadeados:

- **`npm install` via WSL falha com `EACCES`** — o WSL não tem permissão para criar pastas em `/mnt/c/`. A solução foi invocar o `npm` do Windows via `powershell.exe` diretamente do script bash, garantindo que os `node_modules` fossem criados com permissões Windows.

- **Binários nativos incompatíveis** — `node_modules` instalados no Windows contêm binários `win32-x64` (esbuild, por exemplo). Ao tentar executar esses mesmos módulos dentro de containers Linux ou do WSL, o processo falha. A solução foi executar comandos com binários nativos (como o seed com `tsx`) **dentro do container Docker**, que possui seu próprio `node_modules` Linux instalado durante o `docker build`.

- **Metro Bundler no WSL** — o Metro, empacotador do React Native, também falha ao rodar via WSL por não conseguir acessar os arquivos com as permissões corretas. A solução foi executar `npx expo start` sempre pelo CMD do Windows.

### Autenticação e persistência de token

Implementar um fluxo de autenticação robusto em React Native exigiu resolver dois problemas que se intersectam:

- **Acesso síncrono ao token em interceptors Axios** — interceptors de requisição precisam adicionar o header `Authorization` de forma síncrona, mas o `expo-secure-store` é assíncrono. A solução foi manter o token em uma variável em memória (`_token`) que é espelhada no SecureStore de forma assíncrona, garantindo acesso síncrono para o interceptor.

- **Logout automático em resposta 401** — o interceptor de resposta precisa acionar o logout do contexto React, mas não pode importar o contexto diretamente (dependência circular). A solução foi um padrão de callback registrado: o `AuthContext` registra a função `signOut` no módulo de storage na montagem, e o interceptor chama `tokenStorage.triggerLogout()` quando detecta um 401.

- **Chaves do SecureStore** — a API do SecureStore aceita apenas caracteres alfanuméricos, `.`, `-` e `_`. O uso de `:` nas chaves (`auth:token`) causava erros silenciosos no ambiente web e erros explícitos no Expo Go. As chaves foram corrigidas para `auth_token` e `auth_user`.

### Roteamento e guard de autenticação

O roteamento baseado em arquivos do Expo Router simplifica a organização das telas, mas exige cuidado com o ciclo de vida da restauração de sessão. Sem o controle correto do estado `isLoading`, o `Guard` redirecionava o usuário para o login antes da sessão ser restaurada do SecureStore, causando um flash indesejado. A solução foi manter a Splash Screen visível (`SplashScreen.preventAutoHideAsync`) até a restauração ser concluída, e só então escondê-la e executar o redirect.

### Prisma e Docker

A configuração do Prisma em ambiente containerizado trouxe duas lições:

- **Migrations vs. seed** — as migrations (`prisma migrate deploy`) rodam no host WSL apontando para `localhost:5432`, pois o Prisma CLI é JavaScript puro. Já o seed usa `tsx`, que depende do `esbuild` com binário nativo, e precisa rodar dentro do container para usar o binário Linux correto.

- **Bug crítico no UserService** — o método `update` do serviço de usuários foi entregue sem chamar o repositório, retornando `undefined` silenciosamente. O bug só foi descoberto ao testar o fluxo de edição de professores. A identificação foi facilitada pela separação clara entre service e repository, que permitiu isolar e corrigir o problema rapidamente.

---

## Tecnologias utilizadas

**Backend:** Node.js · TypeScript · Express 5 · Prisma 6 · PostgreSQL · JWT · bcrypt · Zod · Swagger · Docker  
**Mobile:** React Native · Expo SDK 54 · Expo Router 6 · TypeScript · Axios · expo-secure-store
