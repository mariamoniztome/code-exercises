import { getDBConnection } from "../database/db.js";

export async function getGenres(req, res) {
  try {
    const db = await getDBConnection();

    const genreRows = await db.all("SELECT DISTINCT genre FROM products");
    const genres = genreRows.map((row) => row.genre);
    res.json(genres);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch genres", details: err.message });
  }
}

export async function getProducts(req, res) {
  try {
    const db = await getDBConnection();

    // let productRows = await db.all('SELECT * FROM products')
    let query = "SELECT * FROM products";
    let params = [];
    const { genre } = req.query;
    if (genre) {
      query += " WHERE genre = ?";
      params.push(genre);
      console.log(params);
    }
    const feed = await db.all(query, params);

    res.json(feed);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: err.message });
  }
}