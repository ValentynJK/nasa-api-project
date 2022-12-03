// Express middleware lives here
const express = require('express');
const path = require('path');
const cors = require('cors'); // allows whitelisting for Cross-Origin Resource Sharing
const morgan = require('morgan');
const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router')

const app = express();
// adding address to "Access-Control-Allow-Origin" header
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(morgan('combined')); // reports all request was made to server

app.use(express.json()); // parse incoming json coming from request body

// serving client side (in 'public folder') as static files
app.use(express.static(path.join(__dirname, '..', 'public')))

// routes
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app