import { useQuery, UseQueryResult } from 'react-query';
import { SqlJsStatic } from 'sql.js';
import { GradesDatabase } from 'utd-grades-db';

export function useDb(): UseQueryResult<GradesDatabase, unknown> {
  return useQuery('db', initCon);
}

async function initCon(): Promise<GradesDatabase> {
  const response = await fetch(
    new URL('../../db/utdgrades.sqlite3', import.meta.url).toString()
  );
  const data = new Uint8Array(await response.arrayBuffer());

  // @ts-expect-error
  const SQL: SqlJsStatic = await window.SQL({
    locateFile: () =>
      new URL(
        '../node_modules/sql.js/dist/sql-wasm.wasm',
        import.meta.url
      ).toString(),
  });

  return new GradesDatabase(new SQL.Database(data));
}
