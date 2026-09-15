import { AutoComplete, Form as AntForm, Input, Popover } from "antd";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import type { SearchQuery } from "../types";
import { getSearchStringRank } from "../utils/index";
import { useDb } from "../utils/useDb";

const autoCompleteStyle: React.CSSProperties = {
  width: "100%",
};

interface SearchProps {
  onSubmit: (query: SearchQuery) => void;
  initialSearchValue?: string;
  showSage?: boolean;
}

export default function Search({ onSubmit, initialSearchValue: initialSearch = "", showSage = true }: SearchProps) {
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

      {showSage && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <a
            href="https://utdsage.com/"
            target="_blank"
            rel="noreferrer"
            className="mb-1 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[rgba(7,67,37,1)] to-[rgba(22,50,36,1)] px-5 py-2.5 text-[#5AED86] shadow-[0_2px_6px_rgb(0_0_0_/_0.2)] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] [text-shadow:0_0_4px_rgb(0_0_0_/_0.6)] hover:scale-[1.01] hover:text-[#5AED86] hover:shadow-[0_2px_8px_rgb(0_0_0_/_0.2)]"
          >
            <img
              src="/SAGE-Logo.svg"
              alt=""
              className="mr-1.5 h-[1.2rem] drop-shadow-[0_0_4px_rgb(0_0_0_/_0.6)]"
            />
            <p className="mb-0 text-[0.9rem] leading-[1.2rem]">Get AI-powered UTD advising with </p>
            <img src="/SAGE-Textmark.svg" alt="Sage" className="h-[1.2rem]" />
          </a>
        </div>
      )}

    </AntForm>
  );
}
