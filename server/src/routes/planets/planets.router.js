const express = require('express');
const { getAllPlanets } = require('./planets.controllers');

// defines route for planets
const planetsRouter = express.Router();

planetsRouter.get('/planets', getAllPlanets);

module.exports = planetsRouter;