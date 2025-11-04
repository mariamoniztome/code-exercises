const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        
  password: '',      
  database: 'database'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar:', err);
  } else {
    console.log('Sucesso');
  }
});

module.exports = db;