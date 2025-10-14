const http = require("http");

const htmlForm = `
  <!DOCTYPE html>
  <html>
  <body>
    <form action="/submit-form" method="POST">
      Name: <input type="text" name="name" />
      <input type="submit" />
    </form>
  </body>
  </html>
`;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlForm);
  } else if (req.method === "POST" && req.url === "/submit-form") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ name: body }));
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found");
  }
});

server.listen(3000, () => {
  console.log("App is listening on PORT 3000");
});