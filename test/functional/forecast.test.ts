import { Beach, BeachPosition } from '../../src/models/beach';
import nock from 'nock';
import stormGlassWeather3HoursFixture from '../fixtures/stormglass_weather_3_hours.json';
import apiForecastReponse1BeachFixture from '../fixtures/api_forecast_response_1_beach.json';
import config from 'config';

describe('Beach forecast functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
    };
    const beach = new Beach(defaultBeach);
    await beach.save();
  });

  it('should return a forecast with just a few times', async () => {
    nock(config.get('App.resources.StormGlass.apiUrl'), {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .reply(200, stormGlassWeather3HoursFixture);
    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastReponse1BeachFixture);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    nock(config.get('App.resources.StormGlass.apiUrl'), {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get(`/forecast`);
    expect(status).toBe(500);
  });
});
