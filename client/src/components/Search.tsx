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

const SageLogo = styled.img`
  height: 1.2rem;
  margin-right: 0.4rem;
  filter: drop-shadow(0 0 4px rgb(0 0 0 / 0.6));
`;

const SageTextMark = styled.img`
  height: 1.2rem;
`;
const SageLink = styled.a`
  background: linear-gradient(90deg, rgba(7,67,37,1) 0%, rgba(22,50,36,1) 100%);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 1.2rem;
  margin-bottom: 0.3rem;
  border-radius: 100rem;
  color: #5AED86;
  text-shadow: 0 0 4px rgb(0 0 0 / 0.6);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.2);
  transition: transform cubic-bezier(0.4, 0, 0.2, 1) 150ms, box-shadow cubic-bezier(0.4, 0, 0.2, 1) 150ms;
  &:hover {
    color: #5AED86;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
    transform: scale(1.01);
  }
`;

const SageText = styled.p`
  line-height: 1.2rem;
  margin-bottom: 0;
  font-size: 0.9rem;
`;
const Popover = styled.div`
  font-family: 'Gilroy-Regular', sans-serif;
  width: 375px;
`;

const DarkModeSearch = styled(Input.Search)`

  .ant-input-group {
    border-radius: 20px;
    overflow: hidden;
  }

  .ant-input-group-addon {
    padding: 0;
    background: #333333;
  }
  .ant-input {
    background-color: #333333;
    color: #ffffff;
    font-family: 'Gilroy', sans-serif;
    height: 44px;
    line-height: 44px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .ant-input::placeholder {
    color: #bfbfbf;
  }

  .ant-input-search-button {
    background-color: #333333;
    color: #ffffff; /* ← THIS */
    height: 44px;
    line-height: 44px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .ant-input-search-button .anticon {
    color: #ffffff; /* ← THIS */
  }

  .ant-input-search-button .anticon svg {
    fill: #ffffff; /* ← THIS (important) */
  }

  .ant-input-search-button:hover {
    background-color: #1a1a1a;
    border-color: #3a3a3a;
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

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <SageLink href="https://utdsage.com/" target="_blank">
          <SageLogo src="/SAGE-Logo.svg" />
          <SageText>Get AI-powered UTD advising with </SageText>
          <SageTextMark src="/SAGE-Textmark.svg" />
        </SageLink>
      </div>

    </AntForm>
  );
}
