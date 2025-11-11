const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// --- MySQL Connection ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // default user in XAMPP
  password: "",        // leave blank if no password
  database: "products"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL database.");
});

// --- Web Routes ---

app.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) throw err;
    res.render("index", { products: results });
  });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/add", (req, res) => {
  const { name, price } = req.body;
  db.query("INSERT INTO products (name, price) VALUES (?, ?)", [name, price], err => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/edit/:id", (req, res) => {
  db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, results) => {
    if (err) throw err;
    res.render("edit", { product: results[0] });
  });
});

app.post("/update/:id", (req, res) => {
  const { name, price } = req.body;
  db.query("UPDATE products SET name = ?, price = ? WHERE id = ?", [name, price, req.params.id], err => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/delete/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], err => {
    if (err) throw err;
    res.redirect("/");
  });
});

// --- API Routes ---

app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/products/:id", (req, res) => {
  db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(results[0]);
  });
});

app.post("/api/products", (req, res) => {
  const { name, price } = req.body;
  db.query("INSERT INTO products (name, price) VALUES (?, ?)", [name, price], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, price });
  });
});

app.put("/api/products/:id", (req, res) => {
  const { name, price } = req.body;
  db.query("UPDATE products SET name = ?, price = ? WHERE id = ?", [name, price, req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product updated" });
  });
});

app.delete("/api/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted" });
  });
});

// --- Start Server ---
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3001"));