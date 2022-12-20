const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const spaceX_query = {
  query: {},
  options: {
    pagination: false,
    populate: [
      {
        path: 'rocket',
        select: {
          name: 1
        }
      },
      {
        path: 'payloads',
        select: {
          'customers': 1
        }
      }
    ]
  }
}
async function populateLaunches() {

  const response = await axios.post(SPACEX_API_URL, spaceX_query, {
    headers: {
      'Accept-Encoding': 'application/json'
    }
  });

  if (response.status !== 200) {
    console.log('Problem occurred during launches populations from SpaceX');
    throw new Error('SpaceX launches data download failed')
  }

  const launchDocs = response.data.docs;
  // mapping return array to receive launches in defined form
  for (const launchDoc of launchDocs) {
    const { flight_number, name, rocket, date_local, upcoming, success, payloads } = launchDoc;
    const customers = payloads.flatMap((payload) => {
      return payload['customers']
    });
    const launch = {
      flightNumber: flight_number,
      mission: name,
      rocket: rocket.name,
      launchDate: new Date(date_local),
      upcoming,
      success,
      customers,

    }
    await saveLaunch(launch)
  }
}


async function loadLaunchData() {
  console.log('loading data from spaceX');

  // to check if all data is loaded
  // TODO: check whether it possible to count records instead
  const firstLaunch = await findLaunch(({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  }))
  if (firstLaunch) {
    console.log('First launch found');
    return;
  } else {
    return await populateLaunches()
  }
}

async function getLatestLaunchId(launchId) {
  const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { '__v': 0, '_id': 0 })
    .sort({ 'flightNumber': 1 }) // sorts by flightNumber in ascending order (-1 for descending)
    .skip(skip) // skips first 20 docs
    .limit(limit) // limits search to 50 els
}

async function saveLaunch(launch) {

  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, { upsert: true }
  )
}

// generic function to find exist launch record
async function findLaunch(filter) {
  return await launches.findOne(filter)
}

// util checks existing launch via Id
async function existLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId
  })
}

// adds new launch to MongoDB launches collection 
async function scheduleNewLaunch(launch) {

  // checks whether launch exist
  const targetPlanet = await planets.findOne({
    keplerName: launch.target
  });

  if (!targetPlanet) {
    throw new Error(`No matching planets found`)
  }

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
  loadLaunchData,
  getAllLaunches,
  existLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById
}