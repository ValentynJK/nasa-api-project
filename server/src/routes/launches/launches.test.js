const request = require('supertest');
const app = require('../../app')

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-type', /json/) // '/json/' is JS regular expression searches for 'json' word to appear
      .expect(200);
  })
});

describe('Test POST /launch', () => {

  const completeLaunchData = {
    mission: 'test mission',
    rocket: 'test rocket',
    target: 'test target',
    launchDate: 'January 2, 2028'
  }

  const missingLaunchData = {
    rocket: 'test rocket',
    target: 'test target',
    launchDate: 'January 2, 2028'
  }

  const launchDataWithoutDate = {
    mission: 'test mission',
    rocket: 'test rocket',
    target: 'test target',
  }

  const launchDataWithInvalidDate = {
    mission: 'test mission',
    rocket: 'test rocket',
    target: 'test target',
    launchDate: 'January 200, 2029'
  }

  test('It should response with 201 created', async () => {
    const response = await request(app)
      .post('/launches')
      .send(completeLaunchData)
      .expect('Content-type', /json/) // '/json/' is JS regular expression searches for 'json' word to appear
      .expect(201)

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate).toBe(responseDate)
    expect(response.body).toMatchObject(launchDataWithoutDate)
  });

  test('It should catch missing date', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchDataWithoutDate)
      .expect('Content-type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({ error: 'Invalid launch date' })

  });
  test('It should catch missing required data', async () => {
    const response = await request(app)
      .post('/launches')
      .send(missingLaunchData)
      .expect('Content-type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({ error: 'Missing required launch property' })

  });

  test('It should catch invalid dates', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchDataWithInvalidDate)
      .expect('Content-type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({ error: 'Invalid launch date' })
  });
})