const axios = require('axios');
const RemoteJsonExtractor = require('../../../../services/etl/extractors/RemoteJsonExtractor');

jest.mock('axios');
describe('Remote Json Extractor', () => {
  beforeAll(() => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({
        data: {
          entry1: 1,
          entry2: {
            subEntry1: 1,
            subEntry2: 2,
          },
        },
      }));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns an object from a json fetched online', async () => {
    const extractor = new RemoteJsonExtractor(
      'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json',
    );
    expect(await extractor.extract()).toMatchInlineSnapshot(`
      {
        "entry1": 1,
        "entry2": {
          "subEntry1": 1,
          "subEntry2": 2,
        },
      }
    `);
  });
});
