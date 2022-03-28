import find from './getSections';
import get from './getSectionById';
import { expandSemesterName, expandSemesterNames } from './utils';
import { Grades } from 'utd-grades-models';
import { SearchQuery } from '../types';
import { Database } from 'sql.js/dist/sql-wasm';

let db: Database;

async function initCon() {
  if (!db) {
    const response = await fetch(
      new URL('../../data/utdgrades.sqlite3', import.meta.url).toString()
    );
    const data = new Uint8Array(await response.arrayBuffer());

    // @ts-ignore
    const SQL = await window.SQL({
      locateFile: () =>
        new URL(
          '../node_modules/sql.js/dist/sql-wasm.wasm',
          import.meta.url
        ).toString(),
    });

    db = new SQL.Database(data);
  }
}

export async function fetchSections(params: SearchQuery): Promise<Grades[]> {
  await initCon();
  return expandSemesterNames(await find(params, db));
}

export async function fetchSection(id: number): Promise<Grades | null> {
  await initCon();
  return expandSemesterName(await get(id, db));
}
