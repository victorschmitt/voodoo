const GameDatabaseBulkLoader = require('../../../../services/etl/loaders/GameDatabaseBulkLoader');
const db = require('../../../../models');

describe('Game model bulk loader', () => {
  beforeAll(async () => {
    await db.Game.sync({ force: true });
  });
  afterAll(async () => {
    await db.Game.sync({ force: true });
  });
  it('returns an object from a json fetched online', async () => {
    const loader = new GameDatabaseBulkLoader();
    await loader.load([
      {
        appVersion: '1.0',
        bundleId: 'com.Psyonix.RL2D',
        isPublished: true,
        name: 'Rocket League Sideswipe',
        platform: 'android',
        publisherId: 'Psyonix+Studios',
        storeId: 'com.Psyonix.RL2D',
      },
      {
        appVersion: '1.18.2.03',
        bundleId: 'com.mojang.minecraftpe',
        isPublished: true,
        name: 'Minecraft',
        platform: 'android',
        publisherId: 'Mojang',
        storeId: 'com.mojang.minecraftpe',
      },
      {
        appVersion: '1.6',
        bundleId: 'com.dino.hide.seek.poppygame',
        isPublished: true,
        name: "Poppy Game - It's Playtime",
        platform: 'android',
        publisherId: 'Zego+Global+Publishing',
        storeId: 'com.dino.hide.seek.poppygame',
      },
    ]);
    // stringify sequelize response for snapshot readability
    const games = JSON.parse(JSON.stringify(await db.Game.findAll({
      attributes: ['appVersion', 'bundleId', 'id', 'isPublished', 'name', 'platform', 'publisherId', 'storeId'],
    })));
    expect(games).toMatchInlineSnapshot(`
    [
      {
        "appVersion": "1.0",
        "bundleId": "com.Psyonix.RL2D",
        "id": 1,
        "isPublished": true,
        "name": "Rocket League Sideswipe",
        "platform": "android",
        "publisherId": "Psyonix+Studios",
        "storeId": "com.Psyonix.RL2D",
      },
      {
        "appVersion": "1.18.2.03",
        "bundleId": "com.mojang.minecraftpe",
        "id": 2,
        "isPublished": true,
        "name": "Minecraft",
        "platform": "android",
        "publisherId": "Mojang",
        "storeId": "com.mojang.minecraftpe",
      },
      {
        "appVersion": "1.6",
        "bundleId": "com.dino.hide.seek.poppygame",
        "id": 3,
        "isPublished": true,
        "name": "Poppy Game - It's Playtime",
        "platform": "android",
        "publisherId": "Zego+Global+Publishing",
        "storeId": "com.dino.hide.seek.poppygame",
      },
    ]
    `);
  });
});
