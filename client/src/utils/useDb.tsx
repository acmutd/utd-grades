import { GradesDatabase } from "@utd-grades/db";
import { useQuery, UseQueryResult } from "react-query";
import type { InitSqlJsStatic, SqlJsStatic } from "sql.js";

export function useDb(): UseQueryResult<GradesDatabase, unknown> {
  return useQuery("db", initCon);
}

// window.SQL is provided by webpack.ProvidePlugin (see next.config.js)
declare global {
  interface Window {
    SQL: InitSqlJsStatic;
  }
}

async function initCon(): Promise<GradesDatabase> {
  const response = await fetch(
    new URL("../../../db/utdgrades.txt", import.meta.url).toString()
  );
  const data = new Uint8Array(await response.arrayBuffer());

  const SQL: SqlJsStatic = await window.SQL({
    locateFile: () =>
      new URL("../../../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url).toString(),
  });

  return new GradesDatabase(new SQL.Database(data));
}
