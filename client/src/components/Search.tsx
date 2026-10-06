import { InfoCircleOutlined } from "@ant-design/icons";
import { AutoComplete, Form as AntForm, Input, Popover } from "antd";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import type { SearchQuery } from "../types";
import { getSearchStringRank } from "../utils/index";
import { useDb } from "../utils/useDb";

const autoCompleteStyle: React.CSSProperties = {
  width: "100%",
};

// On ≤992px the hint spans the screen minus the header's 30px side padding, so it lines up centered under the search row.
const HINT_CONTENT = (
  <div className="w-[375px] font-gilroy-regular max-992:w-[calc(100vw_-_60px_-_32px)]">
    <p>You can search for:</p>
    <ul>
      <li>A specific section: CS 1337.002</li>
      <li>A whole course: CS 1337</li>
      <li>A course name: Computer Science I</li>
      <li>A professor&apos;s name: Jason Smith</li>
      <li>A specific semester: CS 1337 Fall 2021</li>
      <li>Everything together: CS 1337.002 Computer Science I Fall 2021 Jason Smith</li>
    </ul>
  </div>
);

// antd's popover is light-only; point its background, text and arrow at the theme variables.
const HINT_OVERLAY_CLASS =
  "[&_.ant-popover-inner]:bg-card [&_.ant-popover-inner-content]:text-fg [&_.ant-popover-arrow-content]:[--antd-arrow-background-color:var(--card-bg)]";

// Matches the header's ≤992px stacked layout.
function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 992px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return narrow;
}

// ⓘ button that shows the search hint on hover or tap. 18px to match the search button's magnifier icon.
function HintButton() {
  const narrow = useIsNarrow();
  return (
    // On narrow screens the icon sits at the right edge: right-align the full-width hint (which centers it on
    // screen) and point the arrow at the icon instead of leaving it in the middle of the popup.
    <Popover
      content={HINT_CONTENT}
      placement={narrow ? "bottomRight" : "bottom"}
      arrowPointAtCenter={narrow}
      trigger={["hover", "click"]}
      overlayClassName={HINT_OVERLAY_CLASS}
    >
      <button
        type="button"
        aria-label="What can I search for?"
        className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent p-0 text-[18px] text-[#95989a] hover:text-fg"
      >
        <InfoCircleOutlined />
      </button>
    </Popover>
  );
}

interface SearchProps {
  onSubmit: (query: SearchQuery) => void;
  initialSearchValue?: string;
  compact?: boolean;
}

export default function Search({ onSubmit, initialSearchValue: initialSearch = "", compact = false }: SearchProps) {
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const { data: db } = useDb();

  const fetchOptions = useMemo(
    () =>
      debounce((partialQuery: string) => {
        if (db && partialQuery) {
          const strings = db.getSectionStrings(partialQuery);
          const rankedStrings = [...strings].sort(
            (a, b) => getSearchStringRank(a, partialQuery) - getSearchStringRank(b, partialQuery) || a.localeCompare(b)
          );
          setOptions(rankedStrings.map((value) => ({ value })));
        }
      }, 300),
    [db]
  );

  // Set search value to initialSearch when it gets populated in Router
  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  function onChange(value: string) {
    setSearchValue(value);
    fetchOptions(value);
  }

  const input = (
    <AutoComplete
      options={options}
      style={autoCompleteStyle}
      // TODO: find a better type than unknown
      onSelect={(value: unknown) => onSubmit({ search: value as string })}
      onChange={(value: unknown) => onChange(value as string)}
      value={searchValue}
    >
      <Input.Search
        className="search-input-dark"
        onSearch={(search) => onSubmit({ search })}
        name="search"
        size="large"
        placeholder="ex. CS 1337 Fall 2017 Smith"
      />
    </AutoComplete>
  );

  if (!compact) {
    return (
      <AntForm>
        {input}
        <Popover
          className="mx-auto mt-[25px] block font-gilroy-regular text-[#95989a]"
          content={HINT_CONTENT}
          placement="bottom"
          overlayClassName={HINT_OVERLAY_CLASS}
        >
          <span style={{ textAlign: "center" }}>
            Need to know what you can enter?{" "}
            <span style={{ textDecoration: "underline" }}>Pretty much anything.</span>
          </span>
        </Popover>
      </AntForm>
    );
  }

  // Header (compact) layout: an ⓘ hint button just right of the bar.
  return (
    <AntForm>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">{input}</div>
        <HintButton />
      </div>
    </AntForm>
  );
}
