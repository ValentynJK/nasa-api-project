const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6
}

function loadsPlanetData() {

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')) // reading the file line by line as stream; return of every iteration is Buffer object
      .pipe(parse({
        comment: '#',
        columns: true
      })) // connects file to another stream and parse the data received above 
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data)
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err)
      })
      .on('end', () => {
        console.log('habitable planets found: ', habitablePlanets.length);
        resolve()
      })
  })

}

module.exports = {
  loadsPlanetData,
  planets: habitablePlanets
}
