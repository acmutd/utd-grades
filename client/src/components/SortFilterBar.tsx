import { ArrowDownOutlined, ArrowUpOutlined, DownOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React, { useState, type ReactNode } from "react";
import { getFilterOption, getSortOption, type SortDirection, type SortFilterState } from "../utils/sectionMetrics";
import GradeDot from "./GradeDot";
import { chipClassName } from "./chipClassName";

const MEDIAN_FILTER = getFilterOption("median")!;

// The grade chip steps through these on each click, wrapping back to the start.
const GRADE_SORT_CYCLE: { sortField: string; sortDirection: SortDirection }[] = [
  { sortField: "mean", sortDirection: "DESC" },
  { sortField: "mean", sortDirection: "ASC" },
  { sortField: "median", sortDirection: "DESC" },
  { sortField: "median", sortDirection: "ASC" },
];

interface SortFilterBarProps {
  value: SortFilterState;
  onChange: (patch: Partial<SortFilterState>) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 mt-0 font-gilroy-bold text-[0.95rem] font-bold text-fg">{title}</h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function MenuItem({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1.5 rounded bg-transparent px-2 py-1 text-left text-[13px] text-fg hover:bg-card-hover ${
        selected ? "font-gilroy-bold" : "font-gilroy-regular"
      }`}
    >
      {children}
    </button>
  );
}

function MedianFilterDropdown({ value, onChange }: SortFilterBarProps) {
  const [open, setOpen] = useState(false);
  const selectedMin = value.filterField === MEDIAN_FILTER.key ? value.filterMinValue : undefined;
  const selectedGrade = MEDIAN_FILTER.thresholds.find((t) => t.minValue === selectedMin)?.grade;

  const select = (patch: Partial<SortFilterState>) => {
    onChange(patch);
    setOpen(false);
  };

  const menu = (
    <div className="flex max-h-[260px] min-w-[160px] flex-col overflow-y-auto">
      <MenuItem selected={selectedMin === undefined} onClick={() => select({ filterField: undefined, filterMinValue: undefined })}>
        Any median grade
      </MenuItem>
      {MEDIAN_FILTER.thresholds.map((t) => (
        <MenuItem
          key={t.minValue}
          selected={selectedMin === t.minValue}
          onClick={() => select({ filterField: MEDIAN_FILTER.key, filterMinValue: t.minValue })}
        >
          <GradeDot grade={t.grade} />
          {t.label}
        </MenuItem>
      ))}
    </div>
  );

  return (
    <Popover
      content={menu}
      trigger="click"
      placement="bottomLeft"
      open={open}
      onOpenChange={setOpen}
      showArrow={false}
      overlayInnerStyle={{ backgroundColor: "var(--card-bg)" }}
    >
      <button type="button" aria-expanded={open} className={chipClassName(selectedGrade !== undefined)}>
        {selectedGrade ? (
          <>
            <GradeDot grade={selectedGrade} />
            {selectedGrade} or higher
          </>
        ) : (
          "Any median grade"
        )}
        <DownOutlined className="text-[10px] text-description" />
      </button>
    </Popover>
  );
}

function GradeSortChip({ value, onChange }: SortFilterBarProps) {
  const stage = GRADE_SORT_CYCLE.findIndex(
    (s) => s.sortField === value.sortField && s.sortDirection === value.sortDirection
  );
  const active = stage !== -1;
  const next = GRADE_SORT_CYCLE[(stage + 1) % GRADE_SORT_CYCLE.length]!;

  return (
    <button
      type="button"
      aria-pressed={active}
      title="Click to cycle: Mean GPA ↓, Mean GPA ↑, Median Grade ↓, Median Grade ↑"
      onClick={() => onChange(next)}
      className={chipClassName(active)}
    >
      {getSortOption(active ? value.sortField : "mean").label}
      {active && (value.sortDirection === "ASC" ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
    </button>
  );
}

export default function SortFilterBar({ value, onChange }: SortFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-r border-border px-[25px] py-4">
      <Section title="Sort by">
        <button
          type="button"
          aria-pressed={value.sortField === "recent"}
          onClick={() => onChange({ sortField: "recent" })}
          className={chipClassName(value.sortField === "recent")}
        >
          {getSortOption("recent").label}
        </button>
        <GradeSortChip value={value} onChange={onChange} />
      </Section>
      <Section title="Filter by">
        <MedianFilterDropdown value={value} onChange={onChange} />
      </Section>
    </div>
  );
}
