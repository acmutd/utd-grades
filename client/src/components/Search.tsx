import { AutoComplete, Form as AntForm, Input, Popover } from "antd";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import type { SearchQuery } from "../types";
import { getSearchStringRank } from "../utils/index";
import { useDb } from "../utils/useDb";
import PartnerAds from "./PartnerAds";

const autoCompleteStyle: React.CSSProperties = {
  width: "100%",
};

interface SearchProps {
  onSubmit: (query: SearchQuery) => void;
  initialSearchValue?: string;
  showAds?: boolean;
}

export default function Search({ onSubmit, initialSearchValue: initialSearch = "", showAds = true }: SearchProps) {
  const hintContent = (
    <div className="w-[375px] font-gilroy-regular">
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

  return (
    <AntForm>
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
      <Popover
        className="mx-auto mt-[25px] block font-gilroy-regular text-[#95989a]"
        content={hintContent}
        placement="bottom"
      >
        <span style={{ textAlign: "center" }}>
          Need to know what you can enter?{" "}
          <span style={{ textDecoration: "underline" }}>Pretty much anything.</span>
        </span>
      </Popover>

      {showAds && <PartnerAds />}

    </AntForm>
  );
}
