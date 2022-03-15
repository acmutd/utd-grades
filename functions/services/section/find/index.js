const SectionService = require('../service');
const utils = require('./utils');

module.exports = async (queryParams, sequelize) => {
  try {
    let service = new SectionService(sequelize);

    const params = utils.parseSearchStringIfExists(queryParams);

    return await service.find(params);
  } catch (e) {
    throw e;
  }  
};
