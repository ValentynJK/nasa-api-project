// Server code livers here
const http = require('http');
const app = require('./app');

// mongo service connection
const { mongoConnect } = require('../services/mongo')
// models
const { loadsPlanetData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model')

const PORT = process.env.PORT || 8000;

// express 'app' is listener for http server
const server = http.createServer(app);

// common node pattern.
// nothing is rely on startServer() executions, thant why we do not need to await its resolving
async function startServer() {
  await mongoConnect();
  await loadsPlanetData();

  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}......`)
  })
}

startServer()



