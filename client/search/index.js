import find from './getSections';
import get from './getSectionById';
import utils from './utils';
const { CatalogNumber, Grades, Professor, Section, Semester, Subject } = require("utd-grades-models");
const { DataSource } = require("typeorm");

let con;

async function initCon() {
  if (!con) {
    const response = await fetch(new URL("../../data/utdgrades.sqlite3", import.meta.url).toString());
    const data = await response.arrayBuffer();

    con = new DataSource({
      type: "sqljs",
      database: new Uint8Array(data),
      entities: [CatalogNumber, Grades, Professor, Section, Semester, Subject],
      sqlJsConfig: {
        locateFile: () =>
          new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url).toString()
      }
    });

    await con.initialize();
  }
}

export async function fetchSections(params) {
  try {
    await initCon();
    let response = await find(params, con);

    response = utils.expandSemesterNames(response);

    return response; 
  } catch (e) {
    console.log(e);
  }
}

export async function fetchSection(id) {
  try {
    await initCon();
    let response = await get(id, con);
  
    response = utils.expandSemesterName(response);
  
    return response;
  } catch(e) {
    console.log(e);
  }
}
