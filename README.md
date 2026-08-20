# Eventus Pro API

API de gerenciamento de eventos, vendas de ingressos e integração com cinema (TMDB). Construída com Node.js, Fastify, TypeScript, Firebase e Stripe.

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Execução](#execução)
- [Build e Produção](#build-e-produção)
- [Docker](#docker)
- [Deploy no Render](#deploy-no-render)
- [Documentação da API](#documentação-da-api)
  - [Health Check](#health-check)
  - [Usuários (`/user`)](#usuários-user)
  - [Eventos (`/event`)](#eventos-event)
  - [Ingressos (`/ticket`)](#ingressos-ticket)
  - [Filmes (`/movie`)](#filmes-movie)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Padrões e Convenções](#padrões-e-convenções)

---

## Visão Geral

O **Eventus Pro API** é o backend da plataforma Eventus Pro, responsável por:

- Cadastro e gerenciamento de **eventos** (criação, edição, listagem)
- **Venda de ingressos** via checkout Stripe
- **Validação de check-in** por porteiro via QR code/hash
- Compartilhamento de ingressos por hash
- Listagem de **filmes em cartaz** via integração com TMDB
- Autenticação de usuários via **Firebase Auth**

---

## Funcionalidades

### Eventos

- Criar evento com capacidade e preço → cria produto/preço no Stripe
- Gerar assentos automaticamente por capacidade (`A001`, `A002`…)
- Atualizar evento (apenas organizador dono)
- Listar eventos com filtro por organizador
- Buscar evento por ID

### Ingressos

- Criar sessão de checkout Stripe
- Validar pagamento e gerar ingressos com tokens de check-in e compartilhamento (QR code)
- Listar ingressos do cliente autenticado
- Cancelar ingresso com reembolso automático no Stripe e liberação de assentos
- Validar check-in (apenas usuários `doorman`)
- Buscar ingresso compartilhado por hash (rota pública)

### Usuários

- Criar perfil após login Firebase (3 tipos: `organizer`, `client`, `doorman`)
- Buscar dados do usuário autenticado

### Filmes

- Listar filmes populares da TMDB com paginação

---

## Stack Tecnológica

| Camada         | Tecnologia                            |
| -------------- | ------------------------------------- |
| Runtime        | **Node.js 22**                        |
| Linguagem      | **TypeScript 7**                      |
| Framework HTTP | **Fastify 5**                         |
| Validação      | **Zod 4**                             |
| Banco de Dados | **Firebase Firestore**                |
| Autenticação   | **Firebase Auth** (JWT Bearer tokens) |
| Pagamentos     | **Stripe API**                        |
| Filmes         | **TMDB API** + Axios                  |
| QR Code        | **qrcode** (data URLs)                |
| Bundler        | **tsup**                              |
| Dev Server     | **tsx** (watch mode)                  |
| Deploy         | **Docker** + **Render**               |

---

## Arquitetura

O projeto segue princípios **SOLID** com arquitetura em camadas:

```
┌─────────────── HTTP / Fastify Routes (routers)
│
├─────────────── Controllers (parsing, delega para use-cases)
│
├─────────────── Use Cases (regras de negócio, orquestra libs/repositories)
│
├─────────────── Repositories (persistência, usa Database adapter)
│
├─────────────── Factories (construção de entidades, normalização)
│
└─────────────── Lib / Adapters (interfaces + implementações concretas)
                    ├── AuthProvider  → FirebaseAuthProvider
                    ├── Database      → FirestoreDatabase
                    ├── PaymentGateway→ StripePaymentGateway
                    └── MovieProvider → TmdbMovieProvider
```

Todas as dependências externas (Firebase, Stripe, TMDB) são acessadas através de uma **interface** (`src/lib/*/`) com implementação concreta, permitindo trocar de provedor sem impactar os módulos de domínio.

---

## Pré-requisitos

- **Node.js ≥ 22.x** (recomendado usar `nvm` ou `fnm`)
- **npm ≥ 10.x** (vem junto com Node 22)
- Conta no **Firebase** com:
  - Projeto criado
  - Firestore Database habilitado
  - Service Account gerada (JSON)
- Conta no **Stripe** com chave secreta
- Conta no **TMDB** (para chave de API Read Access Token)
- URL do frontend (para redirecionamento do checkout)

---

## Instalação

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd eventus-api
```

### 2. Instale as dependências

```bash
npm install
```

---

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto usando como base o `.env.example` (ou o exemplo abaixo):

```bash
cp .env.example .env
```

Preencha todas as variáveis obrigatórias:

| Variável                | Descrição                                                               | Exemplo                                                         |
| ----------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| `PORT`                  | Porta do servidor HTTP (opcional, padrão `3000`)                        | `3000`                                                          |
| `HOST`                  | Host de escuta (opcional, padrão `0.0.0.0`)                             | `0.0.0.0`                                                       |
| `FIREBASE_PROJECT_ID`   | Project ID da service account Firebase                                  | `meu-projeto-123456`                                            |
| `FIREBASE_CLIENT_EMAIL` | Client email da service account                                         | `firebase-adminsdk@meu-projeto-123456.iam.gserviceaccount.com`  |
| `FIREBASE_PRIVATE_KEY`  | **Conteúdo completo** da chave privada (inclua `\n` como texto literal) | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` |
| `STRIPE_SECRET_KEY`     | Chave secreta do Stripe (formato `sk_test_...` ou `sk_live_...`)        | `sk_test_51U6BjHBF1eXuFgDB...`                                  |
| `FRONTEND_URL`          | URL base do frontend (redirects do checkout)                            | `http://localhost:5173`                                         |
| `TMDB_API_URL`          | URL base da API do TMDB (v3)                                            | `https://api.themoviedb.org/3`                                  |
| `TMDB_ACCESS_TOKEN`     | **Read Access Token** (v4 auth) do TMDB                                 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`                       |

> ⚠️ **Atenção:** O arquivo `.env` está listado no `.gitignore`. **Nunca** comite-o em nenhuma circunstância.

> 💡 **Dica sobre `FIREBASE_PRIVATE_KEY`:** Ao copiar a chave privada do JSON da service account, substitua as quebras de linha reais pelo literal `\n`. O código em `src/lib/firebase/config.ts` já trata isso automaticamente com `.replace(/\\n/g, "\n")`.

### Validação

A configuração é validada no startup por **Zod** em [env.ts](/src/config/env.ts). Se qualquer variável obrigatória faltar ou for inválida, o servidor **não inicia** e exibe o erro exato.

---

## Execução

### Modo desenvolvimento (com hot-reload)

```bash
npm run dev
```

Usa `tsx` em modo watch, carregando automaticamente o `.env` com `--env-file=.env`. O servidor recarrega em cada alteração.

Saída esperada:

```
Server is running on port 3000
```

### Verificar se está rodando

```bash
curl http://localhost:3000/health
```

Retorno:

```json
{ "status": "ok" }
```

---

## Build e Produção

### 1. Compilar para JavaScript

```bash
npm run build
```

Usa `tsup` para compilar `src/` em `dist/`. Resultado:

```
dist/
├── server.js
├── app.js
├── router.js
├── config/
├── lib/
├── ...todos os módulos
```

### 2. Rodar a build de produção

```bash
# Instale apenas dependências de runtime
npm ci --omit=dev

# Execute com Node
NODE_ENV=production node dist/server.js
```

---

## Docker

O projeto inclui um [Dockerfile](Dockerfile) **multi-stage** otimizado:

### Construir a imagem

```bash
docker build -t eventus-api .
```

### Rodar o container

```bash
docker run -p 3000:3000 \
  --env-file .env \
  --name eventus-api \
  eventus-api
```

### Características da imagem

- **Stage 1 (builder):** Instala todas as deps e roda `npm run build`
- **Stage 2 (production):** Apenas `node_modules` de runtime + `dist/`
- Roda como **usuário não-root** (`appuser`) por segurança
- Expõe porta `3000`
- Imagem base: `node:22-alpine` (leve e segura)

Arquivos ignorados no build pelo [.dockerignore](.dockerignore):
`node_modules`, `dist`, `.env`, `.git`, `*.md`

---

## Deploy no Render

O projeto já vem com manifesto [render.yaml](render.yaml) para deploy **Blueprints (Infra as Code)** no [Render.com](https://render.com).

### Deploy via Blueprint

1. No painel do Render, vá em **Blueprints → New Blueprint Instance**
2. Conecte o repositório
3. O Render detecta automaticamente o `render.yaml` e cria:
   - **Serviço Web** `eventus-api` (runtime Docker, plano Starter)
   - **Health Check** em `/health`
   - Variáveis de ambiente marcadas como **sync:false** (preenchimento manual)
4. Preencha as variáveis de ambiente no painel do Render
5. Deploy inicia automaticamente

### Deploy manual (Docker deploy)

Se preferir deploy manual do serviço web Docker:

- **Runtime:** Docker
- **Dockerfile Path:** `./Dockerfile`
- **Health Check Path:** `/health`
- Defina todas as env vars no painel

---

## Documentação da API

**Base URL:** `http://localhost:3000` (dev) ou sua URL de produção.
**Autenticação:** Rotas protegidas esperam `Authorization: Bearer <FIREBASE_ID_TOKEN>`

---

### Health Check

| Método | Rota      | Autenticação | Descrição                   |
| ------ | --------- | ------------ | --------------------------- |
| `GET`  | `/health` | —            | Verifica status do servidor |

---

### Usuários (`/user`)

Todas as rotas exigem `Authorization: Bearer <token>` do Firebase.

| Método | Rota     | Usuário  | Descrição                                               |
| ------ | -------- | -------- | ------------------------------------------------------- |
| `POST` | `/user/` | Qualquer | Cria o perfil local do usuário após login (nome + tipo) |
| `GET`  | `/user/` | Qualquer | Retorna os dados do usuário autenticado                 |

**Corpo do POST `/user/`:**

```json
{
  "name": "Maria Silva",
  "type": "organizer" | "client" | "doorman"
}
```

---

### Eventos (`/event`)

| Método | Rota         | Autenticação | Usuário          | Descrição                                                     |
| ------ | ------------ | ------------ | ---------------- | ------------------------------------------------------------- |
| `GET`  | `/event/`    | —            | —                | Lista eventos (opcional `?organizerId=xyz`)                   |
| `GET`  | `/event/:id` | —            | —                | Detalha um evento por ID                                      |
| `POST` | `/event/`    | ✅           | `organizer`      | Cria novo evento + Product/Price no Stripe + assentos gerados |
| `PUT`  | `/event/:id` | ✅           | Organizador dono | Atualiza evento (apenas o dono)                               |

**Corpo do POST `/event/`:**

```json
{
  "title": "Meu Evento",
  "description": "Descrição completa",
  "date": "2026-09-15T20:00:00Z",
  "local": "Teatro Municipal",
  "capacity": 100,
  "price": 9990
}
```

> `price` em **centavos de real** (R$ 99,90 = `9990`).

---

### Ingressos (`/ticket`)

| Método  | Rota                        | Autenticação | Usuário                  | Descrição                                                  |
| ------- | --------------------------- | ------------ | ------------------------ | ---------------------------------------------------------- |
| `POST`  | `/ticket/checkout`          | ✅           | `client`                 | Cria sessão de checkout Stripe e retorna `checkoutUrl`     |
| `PATCH` | `/ticket/checkout/validate` | —            | —                        | Valida pagamento (após sucesso no Stripe) e gera ingressos |
| `GET`   | `/ticket/`                  | ✅           | `client`                 | Lista ingressos do usuário com dados do evento             |
| `PATCH` | `/ticket/cancel/:id`        | ✅           | Organizador/Cliente dono | Cancela ingresso → reembolso Stripe + libera assentos      |
| `PATCH` | `/ticket/validate/:hash`    | ✅           | `doorman`                | Valida check-in do ingresso pelo hash de check-in          |
| `GET`   | `/ticket/share/:hash`       | —            | —                        | Busca ingresso compartilhado por hash (dados públicos)     |

**Corpo do POST `/ticket/checkout`:**

```json
{
  "eventId": "abc123",
  "seats": ["A001", "A002"]
}
```

**Query do PATCH `/ticket/checkout/validate`:**

```
?ticket/checkout/validate?sessionId=cs_test_a1b2c3
```

---

### Filmes (`/movie`)

| Método | Rota      | Autenticação | Descrição                                    |
| ------ | --------- | ------------ | -------------------------------------------- |
| `GET`  | `/movie/` | —            | Lista filmes populares da TMDB com paginação |

**Query params opcionais:**

```
/movie/?page=2
```

---

## Autenticação e Autorização

### Tipos de Usuário (UserType)

Definidos em [user-type.ts](src/enums/user-type.ts):

| Tipo        | Permissões                                                    |
| ----------- | ------------------------------------------------------------- |
| `organizer` | Criar/editar seus eventos, cancelar ingressos de seus eventos |
| `client`    | Comprar/listar/cancelar seus ingressos                        |
| `doorman`   | Validar check-in de ingressos (`PATCH /validate/:hash`)       |

### Fluxo de autenticação

1. **Frontend** faz login via Firebase Auth (email/senha ou social)
2. Obtém **ID Token** JWT do Firebase
3. Envia nas requisições protegidas:
   ```http
   Authorization: Bearer <ID_TOKEN>
   ```
4. Middleware [auth.middleware.ts](src/middlewares/auth.middleware.ts) verifica o token via Firebase Auth e anexa `request.userAuth`
5. Middleware [get-user.ts](src/middlewares/get-user.ts) busca o perfil local no Firestore por email e anexa `request.userData` (com `id`, `type`, etc.)

> Sem o perfil local criado via `POST /user/`, rotas que usam `getUserMiddleware` retornam `401` — mesmo com token Firebase válido.

---

## Estrutura do Projeto

```
eventus-api/
├── .dockerignore
├── Dockerfile
├── render.yaml
├── package.json
├── tsconfig.json
├── .env                        ← NÃO COMMITAR
├── .gitignore
└── src/
    ├── @types/                 ← Tipagens globais (ex: Fastify augment)
    │   └── fastify.d.ts
    ├── config/
    │   └── env.ts              ← Validação de variáveis (Zod)
    ├── enums/
    │   └── user-type.ts        ← organizer | client | doorman
    ├── errors/                 ← Erros customizados + handler
    ├── lib/                    ← Adapters (interfaces + implementações)
    │   ├── auth/               ← AuthProvider + FirebaseAuthProvider
    │   ├── database/           ← Database interface + FirestoreDatabase
    │   ├── firebase/           ← Config inicial + error-mapper
    │   ├── movies/             ← MovieProvider + TmdbMovieProvider
    │   ├── payment/            ← PaymentGateway + StripePaymentGateway
    │   └── tmdb/client.ts      ← Instância Axios TMDB
    ├── middlewares/
    │   ├── auth.middleware.ts  ← Valida Bearer token
    │   └── get-user.ts         ← Busca usuário local por email
    ├── modules/
    │   ├── event/
    │   │   ├── controllers/
    │   │   ├── models/         ← Event, Seat, Repository interface
    │   │   ├── schemas/        ← Zod schemas por caso de uso
    │   │   ├── use-cases/      ← Regras de negócio
    │   │   ├── event.factory.ts
    │   │   ├── event.repository.ts
    │   │   └── router.ts
    │   ├── movies/
    │   │   ├── controllers/
    │   │   ├── schemas/
    │   │   ├── use-cases/
    │   │   └── router.ts
    │   ├── ticket/
    │   │   ├── controllers/
    │   │   ├── models/         ← Ticket, Repository interface
    │   │   ├── schemas/
    │   │   ├── use-cases/
    │   │   ├── ticket.factory.ts
    │   │   ├── ticket.repository.ts
    │   │   └── router.ts
    │   └── user/
    │       ├── controllers/
    │       ├── models/         ← User, Repository interface
    │       ├── schemas/
    │       ├── use-cases/
    │       ├── user.factory.ts
    │       ├── user.repository.ts
    │       └── router.ts
    ├── utils/
    │   ├── clean-object.ts     ← Limpa null/undefined recursivo
    │   └── generate-seats.ts   ← Gera códigos { code } dos assentos
    ├── app.ts                  ← Instância Fastify, error handler, /health
    ├── router.ts               ← Registra routers dos módulos
    └── server.ts               ← Bootstrap + graceful shutdown
```

---

## Padrões e Convenções

### Commits

Siga o padrão **Conventional Commits** em **Português do Brasil**:

```
<tipo>(<escopo>): <mensagem em pt-BR>
```

Exemplos:

- `feat(ticket): implementa validação de check-in por porteiro`
- `fix(enums): corrige typo ORIGANIZER para ORGANIZER`
- `refactor(lib): abstrai Database via adapter Firestore`
- `chore(deps): atualiza axios para 1.19`
- `docs: atualiza readme com instruções de deploy`

Tipos permitidos: `feat`, `fix`, `refactor`, `perf`, `chore`, `docs`, `style`, `test`, `ci`, `build`.

### Princípios

- **SOLID** aplicado nas camadas de lib (interfaces) e use-cases
- **Single Responsibility:** cada controller, use-case e lib tem uma única responsabilidade
- **Dependency Inversion:** módulos de domínio dependem de interfaces (ex: `Database`), não de Firestore diretamente
- **Fail Fast:** validação de env, schemas e negócios lançam erros cedo com classes tipadas

### Graceful Shutdown

O servidor em [server.ts](src/server.ts) trata os sinais `SIGTERM` e `SIGINT` corretamente:

1. Fecha conexões HTTP pendentes (`app.close()`)
2. Finaliza conexão do Firestore (`firestore.terminate()`)
3. Timeout de segurança de **10 segundos** antes de exit forçado

Isso evita conexões órfãs no Firestore e garante zero-downtime em deploys/rollouts no Render.

---

## Tratamento de Erros

Todas as rotas compartilham o mesmo error handler em [error-handler.ts](src/errors/error-handler.ts), com classes específicas:

| Classe                     | HTTP Code | Cenário                                                       |
| -------------------------- | --------- | ------------------------------------------------------------- |
| `BadRequestError`          | 400       | Dados inválidos (assentos indisponíveis, etc.)                |
| `UnauthorizedError`        | 401       | Token inválido, usuário sem perfil, permissão negada por tipo |
| `ForbiddenError`           | 403       | Ação proibida para o usuário                                  |
| `NotFoundError`            | 404       | Recurso não existe (evento, ingresso, usuário)                |
| `ConflictError`            | 409       | Conflito de estado (ex: checkout ainda não pago)              |
| `UnprocessableEntityError` | 422       | Entidade inválida para processamento                          |

### Exemplo de resposta de erro

```json
{
  "message": "Ingresso já foi validado",
  "statusCode": 400,
  "code": "BadRequest"
}
```

Erros de validação Zod retornam automaticamente 422 com detalhes do campo na mensagem.

---

## Contribuindo

1. Crie uma branch a partir de `main`: `git checkout -b feat/nova-feature`
2. Faça commits pequenos e bem descritos (Conventional Commits PT-BR)
3. Garanta que `npm run dev` inicializa sem erros (validação de env + build typescript)
4. Abra um Pull Request descrevendo o que foi feito

---

## Licença

ISC
