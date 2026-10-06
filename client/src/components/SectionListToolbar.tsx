import { CaretDownOutlined, CaretUpOutlined, CloseOutlined, FilterOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React, { type ReactNode } from "react";
import { getFilterOption, getSortOption, type SortFilterState } from "../utils/sectionMetrics";
import GradeDot from "./GradeDot";

const MEDIAN_FILTER = getFilterOption("median")!;
const SORT_KEYS = ["mean", "median"] as const;

interface SortFilterProps {
  value: SortFilterState;
  onChange: (patch: Partial<SortFilterState>) => void;
}

// Each sort button cycles: off → highest first → lowest first → off (back to the default order).
function sortPatch(value: SortFilterState, key: string): Partial<SortFilterState> {
  if (value.sortField !== key) return { sortField: key, sortDirection: "DESC" };
  if (value.sortDirection === "DESC") return { sortDirection: "ASC" };
  return { sortField: "recent", sortDirection: "DESC" };
}

function sortState(value: SortFilterState, key: string): "DESC" | "ASC" | null {
  return value.sortField === key ? value.sortDirection : null;
}

function selectedThreshold(value: SortFilterState) {
  return value.filterField === MEDIAN_FILTER.key
    ? MEDIAN_FILTER.thresholds.find((t) => t.minValue === value.filterMinValue)
    : undefined;
}

const CLEAR_FILTER: Partial<SortFilterState> = { filterField: undefined, filterMinValue: undefined };
const CLEAR_SORT: Partial<SortFilterState> = { sortField: "recent", sortDirection: "DESC" };

// Always rendered (invisible when off) so toggling a sort doesn't change the button's width.
function SortArrow({ state }: { state: "DESC" | "ASC" | null }) {
  return state === "ASC" ? (
    <CaretUpOutlined />
  ) : (
    <CaretDownOutlined className={state === null ? "invisible" : ""} />
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

function GradeMenu({ value, onChange }: SortFilterProps) {
  const current = selectedThreshold(value);
  return (
    <div className="flex max-h-[260px] min-w-[150px] flex-col overflow-y-auto">
      <MenuItem selected={current === undefined} onClick={() => onChange(CLEAR_FILTER)}>
        Any grade
      </MenuItem>
      {MEDIAN_FILTER.thresholds.map((t) => (
        <MenuItem
          key={t.minValue}
          selected={current === t}
          onClick={() => onChange({ filterField: MEDIAN_FILTER.key, filterMinValue: t.minValue })}
        >
          <GradeDot grade={t.grade} />
          {t.label}
        </MenuItem>
      ))}
    </div>
  );
}

function SortGroup({ value, onChange }: SortFilterProps) {
  return (
    <div role="group" aria-label="Sort" className="inline-flex rounded bg-chip shadow-[0_2px_6px_1px_rgba(0,0,0,0.16)]">
      {SORT_KEYS.map((key, i) => {
        const state = sortState(value, key);
        return (
          <button
            key={key}
            type="button"
            aria-pressed={state !== null}
            onClick={() => onChange(sortPatch(value, key))}
            className={`inline-flex cursor-pointer items-center gap-1.5 bg-transparent px-2 py-[0.3rem] font-gilroy-regular text-[13px] font-medium text-fg first:rounded-l last:rounded-r hover:bg-chip-hover ${
              i > 0 ? "border-l border-border" : ""
            } ${state !== null ? "shadow-[inset_0_-3px_0_var(--select-tag)]" : ""}`}
          >
            {getSortOption(key).label}
            <SortArrow state={state} />
          </button>
        );
      })}
    </div>
  );
}

function SortFilterButton(props: SortFilterProps) {
  const { value } = props;
  const count = (value.sortField !== "recent" ? 1 : 0) + (selectedThreshold(value) ? 1 : 0);
  const panel = (
    <div className="flex w-[230px] flex-col gap-3">
      <SortGroup {...props} />
      <div className="border-t border-border pt-2">
        <GradeMenu {...props} />
      </div>
    </div>
  );
  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      showArrow={false}
      overlayInnerStyle={{ backgroundColor: "var(--card-bg)" }}
      content={panel}
    >
      <button
        type="button"
        aria-label="Sort and filter"
        className="relative flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[20px] border border-[rgb(198,198,198)] bg-transparent text-fg [transition:border-color_0.2s_ease] hover:border-[rgb(116,116,116)]"
      >
        <FilterOutlined />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 rounded-full bg-select-tag px-1.5 font-gilroy-semibold text-[11px] leading-4 text-card">
            {count}
          </span>
        )}
      </button>
    </Popover>
  );
}

function RemovableChip({ onRemove, label, children }: { onRemove: () => void; label: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-chip py-0.5 pl-2.5 pr-1.5 font-gilroy-regular text-[12px] text-fg shadow-[0_2px_6px_1px_rgba(0,0,0,0.16)]">
      {children}
      <button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="flex cursor-pointer items-center bg-transparent p-0 text-[9px] text-description hover:text-fg"
      >
        <CloseOutlined />
      </button>
    </span>
  );
}

interface SectionListToolbarProps extends SortFilterProps {
  total: number;
  matchCount: number | undefined;
}

export default function SectionListToolbar({ total, matchCount, ...props }: SectionListToolbarProps) {
  const { value, onChange } = props;
  const sorting = value.sortField !== "recent";
  const threshold = selectedThreshold(value);

  return (
    <div className="flex flex-col gap-2 border-b border-r border-border px-[25px] py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-gilroy-semibold text-[13px] text-description">
          <span className="text-fg">{matchCount ?? total}</span>
          {matchCount !== undefined && ` of ${total}`} sections
        </span>
        <SortFilterButton {...props} />
      </div>
      {(sorting || threshold) && (
        <div className="flex flex-wrap items-center gap-2">
          {sorting && (
            <RemovableChip label="sort" onRemove={() => onChange(CLEAR_SORT)}>
              {getSortOption(value.sortField).label}
              <SortArrow state={value.sortDirection} />
            </RemovableChip>
          )}
          {threshold && (
            <RemovableChip label="grade filter" onRemove={() => onChange(CLEAR_FILTER)}>
              <GradeDot grade={threshold.grade} />
              {threshold.label}
            </RemovableChip>
          )}
          <button
            type="button"
            onClick={() => onChange({ ...CLEAR_SORT, ...CLEAR_FILTER })}
            className="cursor-pointer bg-transparent p-0 font-gilroy-regular text-[12px] text-description underline hover:text-fg"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
