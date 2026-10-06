import { CaretDownOutlined, CaretUpOutlined, DownOutlined } from "@ant-design/icons";
import type { LetterGrade } from "@utd-grades/db";
import { Popover } from "antd";
import React, { useState, type ReactElement, type ReactNode } from "react";
import { getFilterOption, getSortOption, type SortFilterState } from "../utils/sectionMetrics";
import GradeDot from "./GradeDot";
import { chipClassName } from "./chipClassName";

const MEDIAN_FILTER = getFilterOption("median")!;
const SORT_KEYS = ["mean", "median"] as const;

interface SortFilterBarProps {
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

function GradeMenu({ value, onChange, onPick }: SortFilterBarProps & { onPick: () => void }) {
  const current = selectedThreshold(value);
  const pick = (patch: Partial<SortFilterState>) => {
    onChange(patch);
    onPick();
  };
  return (
    <div className="flex max-h-[260px] min-w-[150px] flex-col overflow-y-auto">
      <MenuItem selected={current === undefined} onClick={() => pick(CLEAR_FILTER)}>
        Any grade
      </MenuItem>
      {MEDIAN_FILTER.thresholds.map((t) => (
        <MenuItem
          key={t.minValue}
          selected={current === t}
          onClick={() => pick({ filterField: MEDIAN_FILTER.key, filterMinValue: t.minValue })}
        >
          <GradeDot grade={t.grade} />
          {t.label}
        </MenuItem>
      ))}
    </div>
  );
}

interface GradeDropdownProps extends SortFilterBarProps {
  renderTrigger: (grade: LetterGrade | undefined) => ReactElement;
}

function GradeDropdown({ value, onChange, renderTrigger }: GradeDropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      showArrow={false}
      overlayInnerStyle={{ backgroundColor: "var(--card-bg)" }}
      open={open}
      onOpenChange={setOpen}
      content={<GradeMenu value={value} onChange={onChange} onPick={() => setOpen(false)} />}
    >
      {renderTrigger(selectedThreshold(value)?.grade)}
    </Popover>
  );
}

const TRIGGER_LABELS: (LetterGrade | undefined)[] = [undefined, ...MEDIAN_FILTER.thresholds.map((t) => t.grade)];

// forwardRef so antd's Popover can attach to the underlying button.
const GradeChipTrigger = React.forwardRef<
  HTMLButtonElement,
  { grade: LetterGrade | undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function GradeChipTrigger({ grade, ...rest }, ref) {
  return (
    <button ref={ref} type="button" {...rest} className={chipClassName(grade !== undefined)}>
      {/* Every label is stacked in one grid cell (only the current one visible) so the chip is always as wide as the widest. */}
      <span className="inline-grid">
        {TRIGGER_LABELS.map((label) => (
          <span
            key={label ?? "any"}
            className={`col-start-1 row-start-1 inline-flex items-center gap-1.5 ${label === grade ? "" : "invisible"}`}
          >
            {label ? (
              <>
                <GradeDot grade={label} />
                {label} or higher
              </>
            ) : (
              "Any grade"
            )}
          </span>
        ))}
      </span>
      <DownOutlined className="text-[10px] text-description" />
    </button>
  );
});

export default function SortFilterBar(props: SortFilterBarProps) {
  const { value, onChange } = props;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-r border-border px-[25px] py-4">
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
      <GradeDropdown {...props} renderTrigger={(grade) => <GradeChipTrigger grade={grade} />} />
    </div>
  );
}
