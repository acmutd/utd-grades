import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import Core from "../components/Core";
import Header from "../components/Header";
import SearchResults from "../components/SearchResults";

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default function ResultsPage() {
  const router = useRouter();

  // FIXME: this probably isn't good
  const search = router.query["search"] as string;
  const sectionId = router.query["sectionId"] as string;

  // Query params not populated on first render in Next.js
  // Migrate to checking Router.ready when available
  // https://github.com/zeit/next.js/issues/8259
  if (router.asPath !== router.route) {
    return (
      <Core>
        <Stack>
          <Header />
          <SearchResults search={search} sectionId={parseInt(sectionId)} router={router} />
        </Stack>
      </Core>
    );
  }

  return null;
}
