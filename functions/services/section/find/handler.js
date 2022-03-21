const doDbOp = require('../../../models');
const respond = require('../../../utils/respond');
const find = require('./index');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    return doDbOp(async (con) => {
      const response = await find(event['queryStringParameters'], con);

      return respond.success(response);
    });
  } catch (e) {
    return respond.error(e);
  }
};
