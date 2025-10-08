// Permite ao Node criar um servidor web e trocar pedidos e respostas (req/res) com o cliente.
// Usa o protocolo HTTP para comunicar.
const http = require('http');
// É o módulo que dá acesso ao sistema de ficheiros do computador.
// Permite ler, escrever, criar, apagar ou listar ficheiros dentro do Node.js.
const fs = require('fs');
// O path serve para construir e manipular caminhos de ficheiros (/, \, etc.)
// O Windows usa \ e o Linux usa /, e o path trata dessas diferenças automaticamente.
const path = require('path');
// Host
const hostname = '127.0.0.1';
// Port
const port = 3000;

const server = http.createServer((req, res) => {
// __dirname é uma variável global do Node.js e vai mostrar o caminho absoluto até ao ficheiro
// Se o req.url for '/', usa o ficheiro 'index01.html'.
// Caso contrário, usa o caminho que o cliente pediu (req.url).
const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index01.html' : req.url);

  // Lê o ficheiro e envia o conteúdo
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      res.end('404 - File Not Found');

    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});