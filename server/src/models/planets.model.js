const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo.js')

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6
}

async function loadsPlanetData() {

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')) // reading the file line by line as stream; return of every iteration is Buffer object
      .pipe(parse({
        comment: '#',
        columns: true
      })) // connects file to another stream and parse the data received above 
      .on('data', async (data) => { // async due to Mongo DB
        if (isHabitablePlanet(data)) {
          await savePlanet(data); // saves planet to MangoDB
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err)
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length
        console.log('habitable planets found: ', countPlanetsFound);
        resolve()
      })
  })
}

async function getAllPlanets() {
  return await planets.find({}, {
    '_id': 0, '__v': 0,
  })
}

async function savePlanet(planet) {
  try {
    // searches for the document by keplerName; --first argument
    // if not found creates document using --second argument
    // not creates duplicates --third argument
    await planets.updateOne({
      keplerName: planet.kepler_name
    }, {
      keplerName: planet.kepler_name
    }, {
      upsert: true
    }
    );
  }
  catch (err) {
    console.error(`Could not save the planet. Error: ${err}`)
  }
}

module.exports = {
  loadsPlanetData,
  getAllPlanets
}
