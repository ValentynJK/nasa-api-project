const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches())
}

// receives launch from client and sets it to back-end
function httpAddNewLaunch(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate); // converts incoming date to required format
  const { mission, rocket, target, launchDate } = launch;
  // checks correctness of date property
  if (isNaN(launchDate) || launchDate < Date.now()) return res.status(400).json({ error: 'Invalid launch date' })
  // checks appearance of date property
  if (!mission || !rocket || !target || !launchDate) return res.status(400).json({ error: 'Missing required launch property' })

  addNewLaunch(launch);
  return res.status(201).json(launch)
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch
}
