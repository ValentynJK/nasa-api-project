const mongoose = require('mongoose');

// for MongoDB connection
const MONGO_URL = `mongodb+srv://nasa-api:EWbTu29fYLr4FaFm@nasacluster.oxbq4ot.mongodb.net/nasa?retryWrites=true&w=majority`

// event emitter which triggered once MongoDB connection is ready 
mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!')
})

// event emitter on error happens
mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL) // connects to DB before server starts listening on PORT
}

// disconnects database from node process 
async function mongoDisconnect() {
  await mongoose.disconnect()
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}
