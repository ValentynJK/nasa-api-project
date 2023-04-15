const { getAllLaunches, scheduleNewLaunch, existLaunchWithId, abortLaunchById } = require('../../models/launches.model');
const { getPagination } = require('../../../services/query')

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

// receives launch from client and sets it to back-end
async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate); // converts incoming date to required format
  const { mission, rocket, target, launchDate } = launch;
  // checks appearance of date property
  if (!mission || !rocket || !target || !launchDate) return res.status(400).json({ error: 'Missing required launch property' })
  // checks correctness of date property
  if (isNaN(launchDate) || launchDate < Date.now()) return res.status(400).json({ error: 'Invalid launch date' })

  await scheduleNewLaunch(launch);
  console.log(launch)
  return res.status(201).json(launch)
}

// deletes an aborted launch
async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existsLaunch = await existLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: 'Launch not found'
    })
  }
  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch was not aborted'
    })
  }
  return res.status(200).json({ ok: true })
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}
