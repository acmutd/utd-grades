import { GPA_POINTS, LETTER_GRADES } from "@utd-grades/db";
import type { Grades, LetterGrade } from "@utd-grades/db";
import type { NextRouter } from "next/router";

export type SortDirection = "ASC" | "DESC";

export interface SortOption {
  key: string;
  label: string;
  getValue(g: Grades): number | null;
}

export interface FilterThreshold {
  grade: LetterGrade;
  label: string;
  minValue: number;
}

export interface FilterOption {
  key: string;
  label: string;
  getValue(g: Grades): number | null;
  thresholds: FilterThreshold[];
}

// Ordinal position (F = 0 … A+ = 12). Medians are compared by rank rather than GPA points
// so that A+ and A stay distinct even though both are worth 4.0.
function gradeRank(grade: LetterGrade): number {
  return LETTER_GRADES.length - 1 - LETTER_GRADES.indexOf(grade);
}

function medianRank(g: Grades): number | null {
  return g.stats.median === null ? null : gradeRank(g.stats.median);
}

// "F or higher" would filter nothing. For mean GPA, A+ is omitted because it's the same 4.0 cutoff as A.
const meanThresholds: FilterThreshold[] = LETTER_GRADES.filter((grade) => grade !== "A+" && grade !== "F").map(
  (grade) => ({ grade, label: `${grade} or higher`, minValue: GPA_POINTS[grade] })
);

const medianThresholds: FilterThreshold[] = LETTER_GRADES.filter((grade) => grade !== "F").map((grade) => ({
  grade,
  label: `${grade} or higher`,
  minValue: gradeRank(grade),
}));

export const SORT_OPTIONS: SortOption[] = [
  { key: "recent", label: "Recent", getValue: () => null }, // no-op: preserves current ranking
  { key: "mean", label: "Mean GPA", getValue: (g) => g.stats.mean },
  { key: "median", label: "Median Grade", getValue: medianRank },
];

export const FILTER_OPTIONS: FilterOption[] = [
  { key: "mean", label: "Mean GPA", getValue: (g) => g.stats.mean, thresholds: meanThresholds },
  { key: "median", label: "Median Grade", getValue: medianRank, thresholds: medianThresholds },
];

export function getSortOption(key: string): SortOption {
  return SORT_OPTIONS.find((o) => o.key === key) ?? SORT_OPTIONS[0]!;
}

export function getFilterOption(key: string | undefined): FilterOption | undefined {
  return FILTER_OPTIONS.find((o) => o.key === key);
}

export function describeFilter(filterField: string, minValue: number): string {
  const option = getFilterOption(filterField);
  const threshold = option?.thresholds.find((t) => t.minValue === minValue);
  return `${option?.label ?? filterField} ${threshold?.label ?? `${minValue} or higher`}`;
}

export interface SortFilterState {
  sortField: string;
  sortDirection: SortDirection;
  filterField: string | undefined;
  filterMinValue: number | undefined;
}

export function parseSortFilterQuery(query: NextRouter["query"]): SortFilterState {
  const sortField = query["sortField"];
  const filterField = query["filterField"];
  const filterMinValue = Number(query["filterMinValue"]);
  const hasFilter =
    typeof filterField === "string" && getFilterOption(filterField) !== undefined && Number.isFinite(filterMinValue);

  return {
    sortField: typeof sortField === "string" && SORT_OPTIONS.some((o) => o.key === sortField) ? sortField : "recent",
    sortDirection: query["sortDirection"] === "ASC" ? "ASC" : "DESC",
    filterField: hasFilter ? filterField : undefined,
    filterMinValue: hasFilter ? filterMinValue : undefined,
  };
}

export function sortFilterToQuery(state: SortFilterState): Record<string, string> {
  const query: Record<string, string> = {};
  if (state.sortField !== "recent") {
    query["sortField"] = state.sortField;
    query["sortDirection"] = state.sortDirection;
  }
  if (state.filterField !== undefined && state.filterMinValue !== undefined) {
    query["filterField"] = state.filterField;
    query["filterMinValue"] = String(state.filterMinValue);
  }
  return query;
}
