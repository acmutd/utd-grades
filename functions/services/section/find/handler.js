const doDbOp = require('../../../models');
const respond = require('../../../utils/respond');
const find = require('./index');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    return doDbOp(async (sequelize) => {
      const response = await find(event['queryStringParameters'], sequelize);

      return respond.success(response);
    });
  } catch (e) {
    return respond.error(e);
  }
};
