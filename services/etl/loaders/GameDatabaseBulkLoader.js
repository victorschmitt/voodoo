const db = require('../../../models');

module.exports = class GameDatabaseBulkLoader {
  async load(data) {
    await db.Game.bulkCreate(data, { updateOnDuplicate: ['storeId'] });
  }
};
