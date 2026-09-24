import { GPA_POINTS, LETTER_GRADES } from "@utd-grades/db";
import type { Grades } from "@utd-grades/db";

export type SortDirection = "ASC" | "DESC";

export interface SortOption {
  key: string;
  label: string;
  getValue(g: Grades): number | null;
}

export interface FilterOption {
  key: string;
  label: string;
  getValue(g: Grades): number | null;
  thresholds: { label: string; minValue: number }[];
}

// Shared GPA-point cutoffs so mean and median filters compare on the same scale.
const gradeThresholds = LETTER_GRADES.map((grade) => ({
  label: `${grade} or higher`,
  minValue: GPA_POINTS[grade],
}));

export const SORT_OPTIONS: SortOption[] = [
  { key: "relevance", label: "Best match", getValue: () => null }, // no-op: preserves current ranking
  { key: "mean", label: "Mean GPA", getValue: (g) => g.stats.mean },
  { key: "median", label: "Median Grade", getValue: (g) => (g.stats.median ? GPA_POINTS[g.stats.median] : null) },
];

export const FILTER_OPTIONS: FilterOption[] = [
  { key: "mean", label: "Mean GPA", getValue: (g) => g.stats.mean, thresholds: gradeThresholds },
  { key: "median", label: "Median Grade", getValue: (g) => (g.stats.median ? GPA_POINTS[g.stats.median] : null), thresholds: gradeThresholds },
];

export function getSortOption(key: string): SortOption {
  return SORT_OPTIONS.find((o) => o.key === key) ?? SORT_OPTIONS[0]!;
}

export function getFilterOption(key: string | undefined): FilterOption | undefined {
  return FILTER_OPTIONS.find((o) => o.key === key);
}
