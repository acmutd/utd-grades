import find, { createWhereString } from './getSections';
import get from './getSectionById';
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
  return await find(params, db);
}

export async function fetchSection(id: number): Promise<Grades | null> {
  await initCon();
  return await get(id, db);
}

export async function getSectionStrings(
  partialQuery: string
): Promise<string[]> {
  if (partialQuery === '') return [];

  await initCon();

  const strings: string[] = [];

  const stmt = db.prepare(
    `SELECT string FROM grades_strings WHERE ${createWhereString(partialQuery)}`
  );
  while (stmt.step()) {
    strings.push(stmt.get()[0] as string);
  }

  return strings;
}
