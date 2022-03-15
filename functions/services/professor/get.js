const ProfessorService = require('./index');
const respond = require('../../utils/respond');
const doDbOp = require('../../models');

module.exports.get = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    return doDbOp(async (sequelize) => {
      let service = new ProfessorService(sequelize);
      let response = await service.get(event.pathParameters.id);

      return respond.success(response);
    });
  } catch (e) {
    return respond.error(e);
  }
};
