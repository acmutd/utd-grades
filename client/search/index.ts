import find from './getSections';
import get from './getSectionById';
import { expandSemesterName, expandSemesterNames } from './utils';
import { DataSource } from 'typeorm';
import {
  CatalogNumber,
  Grades,
  Professor,
  Section,
  Semester,
  Subject,
} from 'utd-grades-models';
import { SearchQuery } from '../types';

let con: DataSource;

async function initCon() {
  if (!con) {
    const response = await fetch(
      new URL('../../data/utdgrades.sqlite3', import.meta.url).toString()
    );
    const data = await response.arrayBuffer();

    con = new DataSource({
      type: 'sqljs',
      database: new Uint8Array(data),
      entities: [CatalogNumber, Grades, Professor, Section, Semester, Subject],
      sqlJsConfig: {
        locateFile: () =>
          new URL(
            '../node_modules/sql.js/dist/sql-wasm.wasm',
            import.meta.url
          ).toString(),
      },
    });

    await con.initialize();
  }
}

export async function fetchSections(params: SearchQuery): Promise<Grades[]> {
  await initCon();
  return expandSemesterNames(await find(params, con));
}

export async function fetchSection(id: number): Promise<Grades | null> {
  await initCon();
  return expandSemesterName(await get(id, con));
}
