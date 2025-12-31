const http = require('http');


const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
    res.end('Você está na página inicial');
  } else if (req.method === 'GET' && req.url === '/sobre') {
    res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
    res.end('Esta é a página Sobre');
  } else if (req.method === 'POST' && req.url === '/contato') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
      res.end('Formulário recebido com sucesso!');
    }); 
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página não encontrada');
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});