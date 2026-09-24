import { useMemo } from "react";
import type { Grades } from "@utd-grades/db";
import { getFilterOption, getSortOption, type SortDirection } from "./sectionMetrics";

export function useSortAndFilter(
  sections: Grades[] | undefined,
  sortKey: string,
  sortDirection: SortDirection,
  filterKey: string | undefined,
  filterMinValue: number | undefined
): Grades[] | undefined {
  return useMemo(() => {
    if (!sections) {
      return sections;
    }

    const filterOption = filterKey ? getFilterOption(filterKey) : undefined;
    const hasFilter = !!filterOption && filterMinValue !== undefined;

    if (sortKey === "relevance" && !hasFilter) {
      return sections;
    }

    let result = sections;

    if (hasFilter) {
      result = result.filter((section) => {
        const value = filterOption!.getValue(section);
        return value !== null && value >= filterMinValue!;
      });
    }

    const sortOption = getSortOption(sortKey);
    if (sortOption.key !== "relevance") {
      const directionMultiplier = sortDirection === "ASC" ? 1 : -1;
      result = [...result].sort((a, b) => {
        const valueA = sortOption.getValue(a);
        const valueB = sortOption.getValue(b);

        if (valueA === null && valueB === null) return 0;
        if (valueA === null) return 1;
        if (valueB === null) return -1;

        return (valueA - valueB) * directionMultiplier;
      });
    }

    return result;
  }, [sections, sortKey, sortDirection, filterKey, filterMinValue]);
}
