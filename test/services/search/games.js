const { searchGamesByNameAndPlatform } = require('../../../services/search/games');
const db = require('../../../models');

describe('Games search service', () => {
  const fixtures = [
    {
      id: 1,
      publisherId: 'fda4848f-9fe6-4703-8f66-544cc146f1ae',
      name: 'Helix Jump',
      platform: 'ios',
      storeId: '1345968745',
      bundleId: 'com.h8games.falldown',
      appVersion: '2.4.2',
      isPublished: true,
      createdAt: '2023-02-08T00:00:00.000Z',
      updatedAt: '2023-02-08T00:00:00.000Z',
    }, {
      id: 2,
      publisherId: 'fda4848f-9fe6-4703-8f66-544cc146f1ae',
      name: 'Helix Jump',
      platform: 'android',
      storeId: 'com.h8games.helixjump',
      bundleId: 'com.h8games.helixjump',
      appVersion: '2.4.4',
      isPublished: true,
      createdAt: '2023-02-08T00:00:00.000Z',
      updatedAt: '2023-02-08T00:00:00.000Z',
    }, {
      id: 3,
      publisherId: 'fda4848f-9fe6-4703-8f66-544cc146f1ae',
      name: 'Swing Rider',
      platform: 'ios',
      storeId: '1441881688',
      bundleId: 'com.semeevs.swingrider',
      appVersion: '1.3',
      isPublished: true,
      createdAt: '2023-02-08T00:00:00.000Z',
      updatedAt: '2023-02-08T00:00:00.000Z',
    },
  ];

  beforeAll(async () => {
    await db.Game.bulkCreate(fixtures);
  });
  afterAll(async () => {
    await db.Game.sync({ force: true });
  });

  it('returns all games if there is no name or platform', async () => {
    // stringify sequelize response for snapshot readability
    const games = JSON.parse(JSON.stringify(await searchGamesByNameAndPlatform()));

    expect(games).toMatchInlineSnapshot(`
    [
      {
        "appVersion": "2.4.2",
        "bundleId": "com.h8games.falldown",
        "createdAt": "2023-02-08T00:00:00.000Z",
        "id": 1,
        "isPublished": true,
        "name": "Helix Jump",
        "platform": "ios",
        "publisherId": "fda4848f-9fe6-4703-8f66-544cc146f1ae",
        "storeId": "1345968745",
        "updatedAt": "2023-02-08T00:00:00.000Z",
      },
      {
        "appVersion": "2.4.4",
        "bundleId": "com.h8games.helixjump",
        "createdAt": "2023-02-08T00:00:00.000Z",
        "id": 2,
        "isPublished": true,
        "name": "Helix Jump",
        "platform": "android",
        "publisherId": "fda4848f-9fe6-4703-8f66-544cc146f1ae",
        "storeId": "com.h8games.helixjump",
        "updatedAt": "2023-02-08T00:00:00.000Z",
      },
      {
        "appVersion": "1.3",
        "bundleId": "com.semeevs.swingrider",
        "createdAt": "2023-02-08T00:00:00.000Z",
        "id": 3,
        "isPublished": true,
        "name": "Swing Rider",
        "platform": "ios",
        "publisherId": "fda4848f-9fe6-4703-8f66-544cc146f1ae",
        "storeId": "1441881688",
        "updatedAt": "2023-02-08T00:00:00.000Z",
      },
    ]
    `);
  });

  it('filters game by platform', async () => {
    // stringify sequelize response for snapshot readability
    const games = JSON.parse(JSON.stringify(await searchGamesByNameAndPlatform('', 'ios')));

    expect(games).toMatchInlineSnapshot(`
    [
      {
        "appVersion": "2.4.2",
        "bundleId": "com.h8games.falldown",
        "createdAt": "2023-02-08T00:00:00.000Z",
        "id": 1,
        "isPublished": true,
        "name": "Helix Jump",
        "platform": "ios",
        "publisherId": "fda4848f-9fe6-4703-8f66-544cc146f1ae",
        "storeId": "1345968745",
        "updatedAt": "2023-02-08T00:00:00.000Z",
      },
      {
        "appVersion": "1.3",
        "bundleId": "com.semeevs.swingrider",
        "createdAt": "2023-02-08T00:00:00.000Z",
        "id": 3,
        "isPublished": true,
        "name": "Swing Rider",
        "platform": "ios",
        "publisherId": "fda4848f-9fe6-4703-8f66-544cc146f1ae",
        "storeId": "1441881688",
        "updatedAt": "2023-02-08T00:00:00.000Z",
      },
    ]
    `);
  });

  it('filters game by fulltext search with name', async () => {
    // stringify sequelize response for snapshot readability
    const games = JSON.parse(JSON.stringify(await searchGamesByNameAndPlatform('Rid')));

    expect(games).toMatchInlineSnapshot(`
    [
      {
        "appVersion": "1.3",
        "bundleId": "com.semeevs.swingrider",
        "createdAt": "2023-02-08T00:00:00.000Z",
        "id": 3,
        "isPublished": true,
        "name": "Swing Rider",
        "platform": "ios",
        "publisherId": "fda4848f-9fe6-4703-8f66-544cc146f1ae",
        "storeId": "1441881688",
        "updatedAt": "2023-02-08T00:00:00.000Z",
      },
    ]
    `);
  });

  it('filters game by name and platform', async () => {
    // stringify sequelize response for snapshot readability
    const games = JSON.parse(JSON.stringify(await searchGamesByNameAndPlatform('Jump', 'android')));

    expect(games).toMatchInlineSnapshot(`
    [
      {
        "appVersion": "2.4.4",
        "bundleId": "com.h8games.helixjump",
        "createdAt": "2023-02-08T00:00:00.000Z",
        "id": 2,
        "isPublished": true,
        "name": "Helix Jump",
        "platform": "android",
        "publisherId": "fda4848f-9fe6-4703-8f66-544cc146f1ae",
        "storeId": "com.h8games.helixjump",
        "updatedAt": "2023-02-08T00:00:00.000Z",
      },
    ]
    `);
  });
});
