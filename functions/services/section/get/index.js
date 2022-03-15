const SectionService = require('../service');

module.exports = async (id, sequelize) => {
  try {
    const service = new SectionService(sequelize);

    return await service.get(id);
  } catch (e) {
    throw e;
  }
};
