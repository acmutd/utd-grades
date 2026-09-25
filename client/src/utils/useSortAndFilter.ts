import { useMemo } from "react";
import type { Grades } from "@utd-grades/db";
import { getFilterOption, getSortOption, type SortDirection } from "./sectionMetrics";

export interface SortFilterResult {
  sections: Grades[] | undefined;
  // Sections matching the active filter are listed first; undefined when no filter is active.
  matchCount: number | undefined;
}

export function useSortAndFilter(
  sections: Grades[] | undefined,
  sortKey: string,
  sortDirection: SortDirection,
  filterKey: string | undefined,
  filterMinValue: number | undefined
): SortFilterResult {
  return useMemo(() => {
    if (!sections) {
      return { sections, matchCount: undefined };
    }

    const sortOption = getSortOption(sortKey);
    let sorted = sections;
    if (sortOption.key !== "recent") {
      const directionMultiplier = sortDirection === "ASC" ? 1 : -1;
      sorted = [...sections].sort((a, b) => {
        const valueA = sortOption.getValue(a);
        const valueB = sortOption.getValue(b);

        if (valueA === null && valueB === null) return 0;
        if (valueA === null) return 1;
        if (valueB === null) return -1;

        return (valueA - valueB) * directionMultiplier;
      });
    }

    const filterOption = filterKey ? getFilterOption(filterKey) : undefined;
    if (!filterOption || filterMinValue === undefined) {
      return { sections: sorted, matchCount: undefined };
    }

    const matching: Grades[] = [];
    const rest: Grades[] = [];
    for (const section of sorted) {
      const value = filterOption.getValue(section);
      (value !== null && value >= filterMinValue ? matching : rest).push(section);
    }
    return { sections: [...matching, ...rest], matchCount: matching.length };
  }, [sections, sortKey, sortDirection, filterKey, filterMinValue]);
}
