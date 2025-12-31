const PORT = 3000;
const HOST = '127.0.0.1'
const http = require("http");

const httpServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  res.end("Hello world");
});

httpServer.listen(PORT, HOST,  () => {
  console.log(`Server is running on port ${PORT}, no host ${HOST}`);
});