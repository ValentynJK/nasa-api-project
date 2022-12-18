const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
}

saveLaunch(launch) // saves the test launch

async function getLatestLaunchId(launchId) {
  const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  // return Array.from(launches.values())
  return await launches
    .find({}, { '__v': 0, '_id': 0 })
}

async function saveLaunch(launch) {

  // checks whether launch exist
  const targetPlanet = await planets.findOne({
    keplerName: launch.target
  });

  if (!targetPlanet) {
    throw new Error(`No matching Errors found`)
  }

  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, { upsert: true }
  )
}

// util checks existing launch via Id
async function existLaunchWithId(launchId) {
  return await launches.findOne({
    flightNumber: launchId
  })
}

// adds new launch to MongoDB launches collection 
async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestLaunchId() + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['Zero to Mastery', 'NASA'],
    upcoming: true,
    success: true
  });

  await launches.updateOne({
    flightNumber: launch.flightNumber
  }, newLaunch, { upsert: true }
  )
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });
  return aborted.acknowledged === true && aborted.modifiedCount === 1
}

module.exports = {
  getAllLaunches,
  existLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById
}