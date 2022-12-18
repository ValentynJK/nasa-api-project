// Server code livers here
const http = require('http');
const app = require('./app');

// mongo service connection
const { mongoConnect } = require('../services/mongo.js')
const { loadsPlanetData } = require('./models/planets.model.js');

const PORT = process.env.PORT || 8000;

// express 'app' is listener for http server
const server = http.createServer(app);

// common node pattern.
// nothing is rely on startServer() executions, thant why we do not need to await its resolving
async function startServer() {
  await mongoConnect();
  await loadsPlanetData();
  server.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}......`)
  })
}

startServer()



