const doDbOp = require('../../../models');
const respond = require('../../../utils/respond');
const get = require('./index');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    return doDbOp(async (con) => {
      const response = await get(event.pathParameters.id, con);

      return respond.success(response);
    });
  } catch (e) {
    return respond.error(e);
  }
};
