const express = require('express');
const { httpGetAllPlanets } = require('./planets.controllers');

// defines route for planets
const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;