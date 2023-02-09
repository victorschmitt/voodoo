const Top100ToGameDatabaseMapper = require('../../../../services/etl/mappers/Top100ToGameDatabaseMapper');
const fixture = require('./fixtures/Top100ToGameDatabaseMapperFixture');

describe('Mapper from top100 data to game object list', () => {
  it('returns an object from a json fetched online', async () => {
    const mapper = new Top100ToGameDatabaseMapper();
    expect(await mapper.map(fixture)).toMatchInlineSnapshot(`
      [
        {
          "appVersion": "1.0",
          "bundleId": "com.Psyonix.RL2D",
          "isPublished": true,
          "name": "Rocket League Sideswipe",
          "platform": "android",
          "publisherId": "Psyonix+Studios",
          "storeId": "com.Psyonix.RL2D",
        },
        {
          "appVersion": "1.18.2.03",
          "bundleId": "com.mojang.minecraftpe",
          "isPublished": true,
          "name": "Minecraft",
          "platform": "android",
          "publisherId": "Mojang",
          "storeId": "com.mojang.minecraftpe",
        },
        {
          "appVersion": "1.6",
          "bundleId": "com.dino.hide.seek.poppygame",
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
