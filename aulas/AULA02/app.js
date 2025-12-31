// app.js - CRUD simples (HTML inline) para Users e Products
const express = require('express');
const app = express();
const port = 3000;

// middlewares para ler body de forms e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- "Banco" em memória (arrays) com alguns dados iniciais
let users = [
  { id: 1, name: 'Ana', email: 'ana@example.com' },
  { id: 2, name: 'Bruno', email: 'bruno@example.com' }
];
let products = [
  { id: 1, name: 'Mouse', price: 29.9 },
  { id: 2, name: 'Teclado', price: 89.0 }
];

// utilitário para gerar ids incrementais
function nextId(collection) {
  return collection.length ? Math.max(...collection.map(x => x.id)) + 1 : 1;
}

// --- Helpers para HTML (header/footer)
function htmlHead(title = 'App') {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 0; }
        header { margin-bottom: 20px; }
        nav a { margin-right: 10px; }
        form input, form button { margin: 5px 0; display:block; }
        table { border-collapse: collapse; width: 100%; max-width: 800px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align:left; }
        th { background: #f4f4f4; }
      </style>
    </head>
    <body>
      <header>
        <h1>${title}</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/users">Usuários</a>
          <a href="/products">Produtos</a>
        </nav>
        <hr/>
      </header>`;
}

function htmlFooter() {
  return `
      <footer><hr/></footer>
    </body>
  </html>`;
}

// --- Rotas principais (Home)
app.get('/', (req, res) => {
  res.send(htmlHead('CRUD Simples') + `
    <p>Projeto de exemplo para ensinar routing e CRUD com páginas HTML (strings no servidor).</p>
    <ul>
      <li><a href="/users">  Usuários</a></li>
      <li><a href="/products">  Produtos</a></li>
    </ul>
  ` + htmlFooter());
});

// -------------------- USUÁRIOS --------------------

// Lista de usuários
app.get('/users', (req, res) => {
  const rows = users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>
        <a href="/users/${u.id}">Ver</a> |
        <a href="/users/${u.id}/edit">Editar</a> |
        <form action="/users/${u.id}/delete" method="POST" style="display:inline">
          <button type="submit" onclick="return confirm('Excluir usuário ${u.name}?')">Excluir</button>
        </form>
      </td>
    </tr>
  `).join('');

  res.send(htmlHead('Usuários') + `
    <a href="/users/new">Criar usuário</a>
    <table>
      <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Ações</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  ` + htmlFooter());
});

// Formulário criar usuário
app.get('/users/new', (req, res) => {
  res.send(htmlHead('Criar Usuário') + `
    <form action="/users" method="POST">
      <label>Nome: <input name="name" required></label>
      <label>Email: <input name="email" type="email" required></label>
      <button type="submit">Criar</button>
    </form>
    <a href="/users">Voltar</a>
  ` + htmlFooter());
});

// Criar (POST)
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: nextId(users), name, email };
  users.push(newUser);
  // após criar, redireciona para lista
  res.redirect('/users');
});

// Ver usuário
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send(htmlHead('Não encontrado') + `<p>Usuário não encontrado</p><a href="/users">Voltar</a>` + htmlFooter());
  res.send(htmlHead(`Usuário ${user.name}`) + `
    <p><strong>ID:</strong> ${user.id}</p>
    <p><strong>Nome:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <a href="/users/${user.id}/edit">Editar</a> | <a href="/users">Voltar</a>
  ` + htmlFooter());
});

// Formulário editar
app.get('/users/:id/edit', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send(htmlHead('Não encontrado') + `<p>Usuário não encontrado</p><a href="/users">Voltar</a>` + htmlFooter());
  res.send(htmlHead(`Editar ${user.name}`) + `
    <form action="/users/${user.id}/update" method="POST">
      <label>Nome: <input name="name" value="${user.name}" required></label>
      <label>Email: <input name="email" type="email" value="${user.email}" required></label>
      <button type="submit">Salvar</button>
    </form>
    <a href="/users/${user.id}">Cancelar</a>
  ` + htmlFooter());
});

// Atualizar (POST)
app.post('/users/:id/update', (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).send(htmlHead('Não encontrado') + `<p>Usuário não encontrado</p><a href="/users">Voltar</a>` + htmlFooter());
  const { name, email } = req.body;
  users[userIndex] = { id, name, email };
  res.redirect(`/users/${id}`);
});

// Excluir (POST)
app.post('/users/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  users = users.filter(u => u.id !== id);
  res.redirect('/users');
});

// -------------------- PRODUTOS --------------------

// Lista produtos
app.get('/products', (req, res) => {
  const rows = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>R$ ${p.price.toFixed(2)}</td>
      <td>
        <a href="/products/${p.id}">Ver</a> |
        <a href="/products/${p.id}/edit">Editar</a> |
        <form action="/products/${p.id}/delete" method="POST" style="display:inline">
          <button type="submit" onclick="return confirm('Excluir produto ${p.name}?')">Excluir</button>
        </form>
      </td>
    </tr>
  `).join('');

  res.send(htmlHead('Produtos') + `
    <a href="/products/new">Criar produto</a>
    <table>
      <thead><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Ações</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  ` + htmlFooter());
});

// Form criar produto
app.get('/products/new', (req, res) => {
  res.send(htmlHead('Criar Produto') + `
    <form action="/products" method="POST">
      <label>Nome: <input name="name" required></label>
      <label>Preço: <input name="price" type="number" step="0.01" required></label>
      <button type="submit">Criar</button>
    </form>
    <a href="/products">Voltar</a>
  ` + htmlFooter());
});

// Criar produto
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: nextId(products), name, price: Number(price) };
  products.push(newProduct);
  res.redirect('/products');
});

// Ver produto
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find(x => x.id === id);
  if (!p) return res.status(404).send(htmlHead('Não encontrado') + `<p>Produto não encontrado</p><a href="/products">Voltar</a>` + htmlFooter());
  res.send(htmlHead(`Produto ${p.name}`) + `
    <p><strong>ID:</strong> ${p.id}</p>
    <p><strong>Nome:</strong> ${p.name}</p>
    <p><strong>Preço:</strong> R$ ${p.price.toFixed(2)}</p>
    <a href="/products/${p.id}/edit">Editar</a> | <a href="/products">Voltar</a>
  ` + htmlFooter());
});

// Form editar produto
app.get('/products/:id/edit', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find(x => x.id === id);
  if (!p) return res.status(404).send(htmlHead('Não encontrado') + `<p>Produto não encontrado</p><a href="/products">Voltar</a>` + htmlFooter());
  res.send(htmlHead(`Editar ${p.name}`) + `
    <form action="/products/${p.id}/update" method="POST">
      <label>Nome: <input name="name" value="${p.name}" required></label>
      <label>Preço: <input name="price" type="number" step="0.01" value="${p.price}" required></label>
      <button type="submit">Salvar</button>
    </form>
    <a href="/products/${p.id}">Cancelar</a>
  ` + htmlFooter());
});

// Atualizar produto
app.post('/products/:id/update', (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).send(htmlHead('Não encontrado') + `<p>Produto não encontrado</p><a href="/products">Voltar</a>` + htmlFooter());
  const { name, price } = req.body;
  products[idx] = { id, name, price: Number(price) };
  res.redirect(`/products/${id}`);
});

// Excluir produto
app.post('/products/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(x => x.id !== id);
  res.redirect('/products');
});

// --- 404 fallback
app.use((req, res) => {
  res.status(404).send(htmlHead('404') + `<p>Página não encontrada</p><a href="/">Home</a>` + htmlFooter());
});

// iniciar servidor
app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`);
});