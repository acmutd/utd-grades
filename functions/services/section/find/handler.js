const { getConnectionManager, createConnection } = require('typeorm');
const { CatalogNumber, Grades, Professor, Section, Semester, Subject } = require("utd-grades-models");
const respond = require('../../../utils/respond');
const find = require('./index');
const fs = require("fs/promises");

let con;

module.exports.handler = async (event, context) => {
// TODO deduplication between here and other handler
  if (!con) {
    const data = await fs.readFile("../data/utdgrades.sqlite3");

    con = await createConnection({
      name: "findSection",
      type: "sqljs",
      database: data,
      entities: [CatalogNumber, Grades, Professor, Section, Semester, Subject],
      // logging: true // useful for debugging
    });
  }

  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const response = await find(event['queryStringParameters'], con);
    return respond.success(response);
  } catch (e) {
    return respond.error(e);
  }
};
