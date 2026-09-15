import { useRouter } from "next/router";
import React from "react";
import Core from "../components/Core";
import Header from "../components/Header";
import SearchResults from "../components/SearchResults";

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
      <Core showSageAd={false}>
        <div className="flex w-full flex-col">
          <Header />
          <SearchResults search={search} sectionId={parseInt(sectionId)} router={router} />
        </div>
      </Core>
    );
  }

  return null;
}
