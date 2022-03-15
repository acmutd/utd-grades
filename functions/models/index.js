const Sequelize = require('sequelize');
const dbConfig = require('../config/db');

const Course = require('./Course');
const Professor = require('./Professor');
const Section = require('./Section');
const Semester = require('./Semester');


async function doDbOp(f) {
  const sequelize = new Sequelize(`postgres://${dbConfig.dbUser}:${dbConfig.dbPass}@${dbConfig.dbHost}/${dbConfig.dbName}`, {
    logging: false,
  });

  Course(sequelize);
  Professor(sequelize);
  Section(sequelize);
  Semester(sequelize);

  // Apply associations
  const models = sequelize.models;

  Object.keys(models).forEach(name => {
    if ('associate' in models[name]) {
      models[name].associate(models);
    }
  });

  // Sync to the database
  await sequelize.sync();

  const r = await f(sequelize);

  await sequelize.close();

  return r;
}

module.exports = doDbOp;
