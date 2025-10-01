import express from 'express';
import startups from './data/data.js'

// Create a new express application instance
const app = express();

console.log(app); // Express gives us many methods to work with

// This is a method app.get() that takes two arguments
// 1. The path for which we want to trigger this method
// 2. A callback function that will be called when the path is matched
app.get('/api', (req, res) => {
    res.json(startups);
})

// Define a route handler for the default home page
app.listen(8000, () => console.log(`Server is running at http://localhost:8000`));