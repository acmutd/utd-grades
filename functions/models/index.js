const createConnection = require("typeorm").createConnection;
const { getConnectionManager } = require("typeorm");
const dbConfig = require('../config/db');

const Course = require("./Course");
const Professor = require("./Professor");
const Section = require("./Section");
const Semester = require("./Semester");

const CONNECTION_NAME = "default";

async function doDbOp(f) {
  const connectionManager = getConnectionManager();

  let con;

  if (connectionManager.has(CONNECTION_NAME)) {
    con = connectionManager.get(CONNECTION_NAME);
  } else {
    con = connectionManager.create({
      name: CONNECTION_NAME,
      type: "postgres",
      host: dbConfig.dbHost,
      username: dbConfig.dbUser,
      password: dbConfig.dbPass,
      database: dbConfig.dbName,
      synchronize: true,
      entities: [Course, Professor, Section, Semester],
      // logging: true,
    });
  }

  if (!con.isConnected) {
    await con.connect();
  }

  return await f(con);
}

module.exports = doDbOp;
