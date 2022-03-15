const ProfessorService = require('./index');
const respond = require('../../utils/respond');
const doDbOp = require('../../models');

module.exports.find = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    return doDbOp(async (sequelize) => {
      let service = new ProfessorService(sequelize);

      let queryParams = event['queryStringParameters'];
      let response = await service.find(queryParams);

      return respond.success(response);
    });
  } catch (e) {
    return respond.error(e);
  }
};
