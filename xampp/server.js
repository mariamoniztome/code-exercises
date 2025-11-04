const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Erro na query:', err);
      res.status(500).send('Erro no servidor');
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});