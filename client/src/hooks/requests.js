const API_URL = "v1"

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  const responseJSON = await response.json();
  return responseJSON;
  // TODO: Once API is ready.
}

// Load launches, sort by flight number, and return as JSON
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const responseJSON = await response.json();
  return responseJSON.sort((a, b) => a.flightNumber - b.flightNumber)
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(launch),
    })
  }
  catch (error) {
    console.log(error)
    return {
      ok: false
    }
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'delete'
    })
  }
  catch (error) {
    console.log(error)
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};