# Node Routes

Servidor HTTP escrito apenas com o módulo nativo `node:http` (sem
framework), para praticar **routing manual** em Node puro: ler
`req.url`/`req.method`, decidir qual resposta enviar e devolver JSON com
os headers e status codes corretos.

## Objetivo de aprendizagem

- Criar um servidor com `http.createServer` e distinguir rotas comparando
  `req.url` e `req.method` "à mão", sem `express.Router`.
- Extrair um segmento dinâmico do URL (ex.: o nome do continente em
  `/api/continent/<continent>`) sem usar `req.params`.
- Definir manualmente `Content-Type`, `statusCode` e uma resposta 404 para
  rotas desconhecidas.
- Isolar os dados de exemplo (`data/data.js`) atrás de uma função de
  acesso assíncrona (`database/db.js`), simulando uma camada de BD.

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
