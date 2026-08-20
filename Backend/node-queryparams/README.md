# Node Query Params

Exercício sobre o módulo nativo `node:http`, pensado para praticar a
leitura de **query strings** (`?chave=valor`) num servidor Node sem
framework. Parte da mesma base de código que `node-routes`.

## Objetivo de aprendizagem

- Criar um servidor com `http.createServer` e fazer routing manual
  comparando `req.url` e `req.method`.
- Devolver respostas JSON com headers e status codes definidos à mão
  (200 para sucesso, 404 para rota desconhecida).
- Isolar os dados de exemplo (`data/data.js`) atrás de uma função de
  acesso assíncrona (`database/db.js`).

> **Estado atual:** no código presente em `server.js`, o filtro por
> continente ainda é feito por **segmento do path**
> (`/api/continent/<continent>`, extraído com `req.url.split('/')`) e não
> por uma verdadeira query string (`?continent=...` lida com
> `new URL(req.url, ...)` ou `URLSearchParams`). Este ficheiro é o ponto
> de partida para evoluir o exercício para parsing de query params reais.

## Tecnologias principais

- Node.js puro (módulo `node:http`), sem dependências externas
- ESM (`type: module`)
- Dataset estático em `data/data.js` (locais turísticos por continente)

## Estrutura

```
server.js          # servidor HTTP e routing manual
database/db.js      # getDataFromDB() — devolve os dados de data.js
data/data.js         # array de destinos (nome, país, continente, etc.)
```

## Como executar

```bash
npm install
node server.js
```

Servidor disponível em `http://localhost:8000` (não há script `start`
definido no `package.json`).

## Principais endpoints

- `GET /api` — devolve todos os destinos
- `GET /api/continent/:continent` — filtra os destinos pelo continente
  indicado no URL (ex.: `/api/continent/Oceania`)
- Qualquer outra rota devolve `404` com `{ error: "not found", ... }`
