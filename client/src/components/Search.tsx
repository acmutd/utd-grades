import { AutoComplete, Form as AntForm, Input, Popover as AntPopover } from "antd";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import type { SearchQuery } from "../types";
import { useDb } from "../utils/useDb";

const autoCompleteStyle: React.CSSProperties = {
  width: "100%",
};

const Hint = styled(AntPopover)`
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  font-family: 'Gilroy-Regular', sans-serif;
  color: #95989a;
`;

const Popover = styled.div`
  font-family: 'Gilroy-Regular', sans-serif;
  width: 375px;
`;

const DarkModeSearch = styled(Input.Search)`

  .ant-input-group {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgb(198, 198, 198);
  }

  .ant-input-group-addon {
    padding: 0;
    background: transparent;
  }
  .ant-input {
    background-color: transparent;
    color: var(--text-color);
    font-family: 'Gilroy', sans-serif;
    height: 44px;
    line-height: 44px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .ant-input::placeholder {
    color: var(--search-placeholder);
  }

  .ant-input-search-button {
    background-color: transparent;
    height: 44px;
    line-height: 44px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .ant-input-search-button .anticon {
    color: #95989a;
  }

  .ant-input-search-button .anticon svg {
    fill: currentColor;
  }

  .ant-input-search-button:hover {
    opacity: 0.95;
  }
`;


interface SearchProps {
  onSubmit: (query: SearchQuery) => void;
  initialSearchValue?: string;
}

export default function Search({ onSubmit, initialSearchValue: initialSearch = "" }: SearchProps) {
  const hintContent = (
    <Popover>
      <p>You can search for:</p>
      <ul>
        <li>A specific section: CS 1337.002</li>
        <li>A whole course: CS 1337</li>
        <li>A professor&apos;s name: Jason Smith</li>
        <li>A specific semester: CS 1337 Fall 2021</li>
        <li>Everything together: CS 1337.002 Fall 2021 Jason Smith</li>
      </ul>
    </Popover>
  );

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const { data: db } = useDb();

  const fetchOptions = useMemo(
    () =>
      debounce((partialQuery: string) => {
        if (db && partialQuery) {
          const strings = db.getSectionStrings(partialQuery);
          setOptions(strings.map((value) => ({ value })));
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
        <DarkModeSearch
          onSearch={(search) => onSubmit({ search })}
          name="search"
          size="large"
          placeholder="ex. CS 1337 Fall 2017 Smith"
        />
      </AutoComplete>
      <Hint content={hintContent} placement="bottom">
        <span style={{ textAlign: "center" }}>
          Need to know what you can enter?{" "}
          <span style={{ textDecoration: "underline" }}>Pretty much anything.</span>
        </span>
      </Hint>
    </AntForm>
  );
}
