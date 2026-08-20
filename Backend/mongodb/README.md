# MongoDB

Exercício mínimo para praticar a ligação a uma base de dados **MongoDB
Atlas** (cluster na cloud) a partir de Node.js, usando o driver oficial
`mongodb`.

## Objetivo de aprendizagem

- Usar o `MongoClient` do pacote `mongodb` para abrir uma ligação a um
  cluster Atlas via connection string (`mongodb+srv://...`).
- Selecionar uma base de dados (`client.db('bank')`) depois de ligado.
- Perceber a estrutura básica de um script Node em CommonJS
  (`require`/`module.exports`).

## Tecnologias principais

- Node.js (CommonJS, `type: commonjs`)
- Driver oficial `mongodb` (`^6.20.0`)
- MongoDB Atlas (cluster remoto na cloud)

## Estrutura

```
app.js          # cria o MongoClient, liga ao Atlas e seleciona a BD "bank"
atlas_uri.js     # exporta a connection string do cluster Atlas
```

## Como executar

```bash
npm install
node app.js
```

Ao correr, o script liga-se ao cluster definido em `atlas_uri.js` e
imprime no terminal se a ligação foi bem-sucedida.

> **Nota de segurança:** `atlas_uri.js` contém utilizador e password do
> cluster escritos diretamente no código e commitados no repositório. Para
> um projeto real, este valor devia vir de uma variável de ambiente
> (`.env` + `.gitignore`) e as credenciais deviam ser rodadas.

Este projeto não tem rotas HTTP nem servidor — é apenas um script de
ligação à base de dados, sem endpoints expostos.
