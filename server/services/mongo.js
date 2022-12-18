const mongoose = require('mongoose');
const config = require('dotenv').config();

// for MongoDB connection
const MONGO_URL = process.env.MONGO_URL

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
