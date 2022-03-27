import React from 'react';
import SearchResults from '../components/SearchResults'
import Core from '../components/Core';
import Header from '../components/Header';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default function ResultsPage() {
  const router = useRouter();

  const { search, sectionId } = router.query;

  // Query params not populated on first render in Next.js
  // Migrate to checking Router.ready when available
  // https://github.com/zeit/next.js/issues/8259
  if (router.asPath !== router.route) {
    return (
      <Core>
        <Stack>
          <Header />
          <SearchResults
            search={search}
            sectionId={sectionId}
            router={router}
          />
        </Stack>
      </Core>
    );
  }

  return null;
}
