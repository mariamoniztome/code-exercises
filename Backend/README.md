# Backend

Coleção de pequenos exercícios de backend em Node.js, cada um num
subprojeto independente (com o seu próprio `package.json`), progredindo
desde routing manual com o módulo nativo `http` até uma API Express
completa com autenticação e base de dados.

## Projetos

- [authentication](./authentication/README.md) — loja de vinis "Spiral
  Sounds" com registo/login/logout, sessões (`express-session`) e carrinho
  de compras protegido por autenticação, usando SQLite.
- [express](./express/README.md) — API "Startup Planet" para praticar
  routing com Express (`Router`, controllers, CORS, filtros por query
  string e por parâmetro de rota).
- [middleware](./middleware/README.md) — versão simplificada da loja de
  vinis focada em middleware Express (`app.use`, logging, static files) e
  numa API de produtos ligada a SQLite.
- [mongodb](./mongodb/README.md) — script mínimo de ligação a um cluster
  MongoDB Atlas com o driver oficial `mongodb`.
- [node-queryparams](./node-queryparams/README.md) — servidor HTTP puro
  (`node:http`), ponto de partida para praticar parsing de query strings.
- [node-routes](./node-routes/README.md) — servidor HTTP puro
  (`node:http`) com routing manual por `req.url`/`req.method`.

Cada subprojeto tem instruções próprias de instalação e execução no seu
respetivo README.
