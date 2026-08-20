# Authentication (Spiral Sounds)

Loja fictícia de vinis ("Spiral Sounds") que serve de exercício para praticar
**autenticação de utilizadores com sessões** numa API Express: registo,
login, logout, proteção de rotas e um carrinho de compras associado ao
utilizador autenticado.

## Objetivo de aprendizagem

- Criar contas e autenticar utilizadores com password encriptada (`bcryptjs`)
  e validação de dados (`validator`).
- Gerir sessões de utilizador com `express-session` (cookie `httpOnly`),
  em vez de tokens JWT.
- Proteger rotas privadas com um middleware de autenticação (`requireAuth`)
  que verifica `req.session.userId`.
- Persistir utilizadores, produtos e itens do carrinho em SQLite.

## Tecnologias principais

- Node.js + Express (`type: module`, ESM)
- `express-session` para sessões autenticadas
- `bcryptjs` para hash de passwords
- `validator` para validar emails
- `sqlite` / `sqlite3` como base de dados (ficheiro `database.db`)
- HTML/CSS/JS vanilla em `public/` como frontend da loja

## Estrutura

```
server.js                 # arranque do Express, sessão e montagem das rotas
routes/                   # auth.js, me.js, products.js, cart.js
controllers/              # authController, meController, productsController, cartController
middleware/requireAuth.js # bloqueia acesso sem sessão ativa
db/db.js                  # ligação ao SQLite (database.db)
sql/, db/createTable.js   # scripts de criação/seed das tabelas
public/                   # index.html, login.html, cart.html, signup.html, JS/CSS do cliente
```

## Como executar

```bash
npm install
npm start          # equivale a: node server.js
```

Servidor disponível em `http://localhost:8000`. Antes de usar pela primeira
vez, corre `node db/createTable.js` para criar as tabelas na base de dados
SQLite.

## Principais endpoints

- `POST /api/auth/register` — cria conta (nome, email, username, password)
- `POST /api/auth/login` — autentica e inicia sessão
- `GET /api/auth/logout` — termina a sessão
- `GET /api/auth/me` — devolve o utilizador autenticado (ou `isLoggedIn: false`)
- `GET /api/products` / `GET /api/products/genres` — lista produtos/géneros
- `POST /api/cart/add`, `GET /api/cart/`, `GET /api/cart/cart-count`,
  `DELETE /api/cart/:itemId`, `DELETE /api/cart/all` — carrinho (requer sessão ativa)
