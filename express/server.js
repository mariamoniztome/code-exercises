import express from 'express';

const PORT = 8000;

// Create a new express application instance
const app = express();

// Define a route handler for the default home page
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});