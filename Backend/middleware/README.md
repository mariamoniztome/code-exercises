# Middleware (Spiral Sounds — loja de vinis)

Versão simplificada da loja de vinis "Spiral Sounds", focada em praticar o
conceito de **middleware no Express**: funções que correm antes das rotas
(logging, parsing, etc.) e a organização de uma API em `Router` +
controllers ligados a uma base de dados SQLite.

## Objetivo de aprendizagem

- Perceber a ordem de execução de `app.use()` e como um middleware chama
  `next()` para passar o controlo adiante (ver exemplos comentados em
  `server.js`, prontos para serem ativados: logging de pedidos e timestamp).
- Servir ficheiros estáticos (`express.static('public')`) juntamente com
  uma API JSON.
- Ler e filtrar dados de uma tabela SQLite (`products`) por género ou
  termo de pesquisa via query string.
- Separar rotas (`routes/`) de controllers (`controller/`) e de acesso a
  dados (`database/`).

## Tecnologias principais

- Node.js + Express (ESM, `type: module`)
- `sqlite` / `sqlite3` (ficheiro `database.db`)
- `validator` (disponível como dependência, para validações futuras)
- HTML/CSS/JS vanilla em `public/` como frontend simples da loja

## Estrutura

```
server.js                    # arranque do Express + exemplos comentados de middleware
routes/products.js           # monta /api/products e /api/products/genres
controller/productsControllers.js  # getProducts (com filtro genre/search), getGenres
database/db.js               # ligação ao SQLite (database.db)
database/createTable.js      # cria a tabela products
database/seedTable.js        # popula a tabela products
database/data.js             # dados usados no seed
public/                      # index.html, index.css, index.js e imagens
```

## Como executar

```bash
npm install
node database/createTable.js   # cria a tabela products
node database/seedTable.js     # popula a tabela com dados
npm start                      # equivale a: node server.js
```

Servidor disponível em `http://localhost:8000`.

## Principais endpoints

- `GET /` — página HTML simples de boas-vindas
- `GET /api/products` — lista produtos; aceita `?genre=` ou `?search=`
  (pesquisa por título, artista ou género)
- `GET /api/products/genres` — lista os géneros distintos disponíveis
