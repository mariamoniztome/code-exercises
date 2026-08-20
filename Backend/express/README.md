# Express (Startup Planet)

API sobre um dataset de startups ("startup_planet") usada para praticar a
transição do módulo `http` nativo do Node para o **Express**, incluindo
routers dedicados, query strings e parâmetros de rota dinâmicos.

## Objetivo de aprendizagem

- Criar rotas Express (`app.get`) e filtrar uma coleção em memória com base
  em vários parâmetros de query (`industry`, `country`, `continent`,
  `is_seeking_funding`, `has_mvp`).
- Usar parâmetros de rota dinâmicos (`/api/:field/:term`) e validar campos
  permitidos antes de fazer a pesquisa.
- Separar a aplicação em `express.Router()` + controllers dedicados
  (`routes/apiRouter.js`, `controllers/`).
- Ativar CORS e tratar rotas inexistentes com um handler 404.

Este projeto tem duas versões: `server.js` (tudo num único ficheiro, com
filtragem por query string e por parâmetro de rota) e `server-router.js`
(versão mais organizada, com `Router` e controllers separados) — é esta
segunda que o `npm start` arranca.

## Tecnologias principais

- Node.js + Express (ESM, `type: module`)
- `cors` (usado em `server-router.js` para libertar o acesso entre origens)
- Dataset estático em `data/data.js`

## Estrutura

```
server.js              # versão com filtros por query string e /:field/:term
server-router.js        # versão com Router + CORS + 404 handler (entry point do npm start)
routes/apiRouter.js      # monta /api/products e /api/service
controllers/products.js  # controller de exemplo (resposta fixa)
controllers/services.js  # controller de exemplo (resposta fixa)
data/data.js             # array de startups usado por server.js
```

## Como executar

```bash
npm install
npm install cors   # 'cors' é usado no código mas não está no package.json
npm start          # equivale a: node server-router.js
```

Servidor disponível em `http://localhost:8000`. Para testar a versão
alternativa com os filtros de startups, corre `node server.js` diretamente.

## Principais endpoints

`server-router.js` (via `npm start`):
- `GET /api/products` — resposta de exemplo `{ data: 'products' }`
- `GET /api/service` — resposta de exemplo `{ data: 'service' }`

`server.js` (dataset de startups):
- `GET /api` — lista startups, filtrável por `?industry=`, `?country=`,
  `?continent=`, `?is_seeking_funding=`, `?has_mvp=`
- `GET /api/:field/:term` — pesquisa por `country`, `continent` ou
  `industry` (ex.: `/api/country/india`)
