/* eslint-disable import/no-dynamic-require */
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const { searchGamesByNameAndPlatform } = require('./services/search/games');
const ETL = require('./services/etl');
const RemoteJsonExtractor = require('./services/etl/extractors/RemoteJsonExtractor');
const GameDatabaseBulkLoader = require('./services/etl/loaders/GameDatabaseBulkLoader');
const Top100ToGameDatabaseMapper = require('./services/etl/mappers/Top100ToGameDatabaseMapper');

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/config/config.json`)[env];

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

app.get('/api/games', async (req, res) => {
  try {
    const games = await db.Game.findAll();
    return res.send(games);
  } catch (err) {
    console.error('There was an error querying games', err);
    return res.send(err);
  }
});

app.post('/api/games', async (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished });
    return res.send(game);
  } catch (err) {
    console.error('***There was an error creating a game', err);
    return res.status(400).send(err);
  }
});

app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await db.Game.findByPk(parseInt(req.params.id, 10));
    await game.destroy({ force: true });
    return res.send({ id: game.id });
  } catch (err) {
    console.error('***Error deleting game', err);
    return res.status(400).send(err);
  }
});

app.put('/api/games/:id', async (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.findByPk(id);
    await game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished });
    return res.send(game);
  } catch (err) {
    console.error('***Error updating game', err);
    return res.status(400).send(err);
  }
});
app.post('/api/games/search', async (req, res) => {
  const { name, platform } = req.body;
  try {
    return res.send(await searchGamesByNameAndPlatform(name, platform));
  } catch (err) {
    console.error('***There was an error searching games', err);
    return res.status(400).send(err);
  }
});

app.post('/api/games/populate', async (req, res) => {
  try {
    await Promise.all(config.populateUrls.map(
      (url) => {
        console.log(url);
        const etl = new ETL(
          new RemoteJsonExtractor(url),
          new Top100ToGameDatabaseMapper(),
          new GameDatabaseBulkLoader(),
        );
        return etl.run();
      },
    ));

    const games = await db.Game.findAll();
    return res.send(games);
  } catch (err) {
    console.error('***There was an error populating', err);
    return res.status(400).send(err);
  }
});

module.exports = app;
