import { Beach } from '../../src/models/beach';

describe('Beaches functional tests', () => {
  beforeAll(async () => {
    await Beach.deleteMany({});
  });

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -26.940075,
        lng: -48.6396993,
        name: 'Praia Brava - Itajaí',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should throw 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };
      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" at path "lat"',
      });
    });

    it.skip('should return 500 when there any error other than validation error', async () => {
      //TODO think in a way to throw a 500
    });
  });
});
