const { Op } = require('sequelize');
const db = require('../../models');

async function searchGamesByNameAndPlatform(name, platform) {
  const where = {};

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`,
    };
  }

  if (platform) {
    where.platform = platform;
  }

  return db.Game.findAll({
    where,
  });
}

module.exports = {
  searchGamesByNameAndPlatform,
};
