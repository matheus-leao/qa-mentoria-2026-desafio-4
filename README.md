# API Biblioteca (REST)

API em **Node.js**, **Express** e **JavaScript** para o sistema de gerenciamento de biblioteca descrito em `docs/requisitos.md`. Persistência **em memória** (variáveis).

## Pré-requisitos

- Node.js **18+**
- npm

## Configuração

1. Clone o repositório e instale dependências:

```bash
npm install
```

2. (Opcional) Crie um arquivo `.env` na raiz do projeto:

| Variável     | Descrição                        | Padrão                        |
| ------------ | -------------------------------- | ----------------------------- |
| `PORT`       | Porta HTTP                       | `3000`                        |
| `JWT_SECRET` | Segredo para assinatura dos JWTs | valor de desenvolvimento fixo |

Exemplo:

```env
PORT=3000
JWT_SECRET=sua-chave-secreta-longa
```

## Como executar

```bash
npm start
```

Para reinício automático ao editar arquivos (Node 18+):

```bash
npm run dev
```

A API sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

## Documentação Swagger

- **Interface Swagger UI:** `http://localhost:3000/api-docs`
- **Especificação OpenAPI (JSON):** `http://localhost:3000/openapi.json`

## Autenticação (JWT)

Rotas protegidas usam o cabeçalho:

```http
Authorization: Bearer <token>
```

- **Leitores:** obtêm token em `POST /auth/login` com `email` e `senha`.
- **Administradores:** obtêm token em `POST /auth/admin/login` com `id_funcionario` e `senha`.

Conforme `requisitos.md`, a operação de **empréstimo** é `POST /login` com **Bearer** de leitor (não é o login que obtém o token; é a rota nomeada para o empréstimo).

## Endpoints principais

| Método | Rota                   | Auth          | Descrição                                 |
| ------ | ---------------------- | ------------- | ----------------------------------------- |
| GET    | `/health`              | —             | Saúde do serviço                          |
| POST   | `/administradores`     | —             | Criação de administrador                  |
| PUT    | `/administradores/:id` | —             | Edição de administrador                   |
| DELETE | `/administradores/:id` | —             | Exclusão de administrador                 |
| POST   | `/leitores`            | —             | Criação de leitor                         |
| PUT    | `/leitores/:id`        | —             | Edição de leitor                          |
| DELETE | `/leitores/:id`        | —             | Exclusão de leitor                        |
| POST   | `/auth/login`          | —             | Login leitor → JWT                        |
| POST   | `/auth/admin/login`    | —             | Login admin → JWT                         |
| POST   | `/livros`              | Bearer        | Criação de livro (usuário autenticado)    |
| PUT    | `/livros/:id_livro`    | Bearer        | Edição de livro                           |
| DELETE | `/livros/:id_livro`    | Bearer        | Exclusão de livro                         |
| POST   | `/login`               | Bearer leitor | Empréstimo (ISBN em `id_livro`)           |
| POST   | `/devolucoes`          | Bearer leitor | Devolução (`id_emprestimo` ou `id_livro`) |

## Testes com Supertest

O projeto separa `app.js` (aplicação Express **sem** `listen`) e `server.js` (sobe o servidor). Para testes, importe apenas o app:

```javascript
import request from "supertest";
import app from "./app.js";
```

## Estrutura de pastas

- `app.js` / `server.js` — entrada e servidor HTTP
- `src/controller/` — controladores HTTP
- `src/service/` — regras de negócio
- `src/model/` — estado em memória
- `src/middleware/` — autenticação JWT
- `src/config/` — documentação OpenAPI

## Referência de regras de negócio

Detalhes de validação, códigos HTTP e mensagens de erro estão em `docs/requisitos.md`.
