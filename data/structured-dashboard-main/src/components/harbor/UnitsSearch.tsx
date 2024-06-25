// components/Search.tsx

import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
} from 'react-instantsearch-hooks-web';
import React from 'react';

// Create an Algolia client
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY!
);

// Component to display each hit
const Hit = ({ hit }: { hit: any }) => (
  <div>
    <Highlight attribute="name" hit={hit} />
  </div>
);

const SearchComponent: React.FC = () => {
  return (
    <InstantSearch
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
      searchClient={searchClient}
    >
      <div>
        <h1>Search</h1>
        <SearchBox />
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
};

export default SearchComponent;
