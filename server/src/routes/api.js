const express = require('express');
const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router')

const api = express.Router();

// routes
api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = {
  api
}



