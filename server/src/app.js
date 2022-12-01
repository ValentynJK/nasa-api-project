// Express middleware lives here
const express = require('express');
const path = require('path');
const cors = require('cors'); // allows whitelisting for Cross-Origin Resource Sharing
const planetsRouter = require('./routes/planets/planets.router');

const app = express();
// adding address to "Access-Control-Allow-Origin" header
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json()); // parse incoming json coming from request body

// serving client side (in 'public folder') as static files
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(planetsRouter);

module.exports = app