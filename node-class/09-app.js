const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/api/users', function(req, res) {
  res.send('Lista de usuários');
});

app.listen(3000, function() {
  console.log('Servidor na porta 3000');
});