import { AutoComplete, Form as AntForm, Input, Popover as AntPopover } from "antd";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import type { SearchQuery } from "../types";
import { useDb } from "../utils/useDb";

const StyledAutoComplete = styled(AutoComplete)`
  &&& {
    width: 100%;
  }
`;

const StyledSearch = styled(Input.Search)`
  &&& {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    outline: none;
    font-family: var(--font-family);
  }
`;

const Hint = styled(AntPopover)`
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  font-family: var(--font-family);
  color: #95989a;
`;

const Popover = styled.div`
  font-family: var(--font-family);
  width: 375px;
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
        <li>A specific section: CS 1337.501</li>
        <li>A whole course: CS 1337</li>
        <li>A professor&apos;s name: Jason Smith</li>
        <li>A specific semester: CS 1337 Fall 2021</li>
        <li>Everything together: CS 1337.001 Fall 2021 Jason Smith</li>
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
      <StyledAutoComplete
        options={options}
        // TODO: find a better type than unknown
        onSelect={(value: unknown) => onSubmit({ search: value as string })}
        onChange={(value: unknown) => onChange(value as string)}
        value={searchValue}
      >
        <StyledSearch
          onSearch={(search) => onSubmit({ search })}
          name="search"
          size="large"
          placeholder="ex. CS 1337 Fall 2017 Smith"
        />
      </StyledAutoComplete>
      <Hint content={hintContent} placement="bottom">
        <span style={{ textAlign: "center" }}>
          Need to know what you can enter?{" "}
          <span style={{ textDecoration: "underline" }}>Pretty much anything.</span>
        </span>
      </Hint>
    </AntForm>
  );
}
