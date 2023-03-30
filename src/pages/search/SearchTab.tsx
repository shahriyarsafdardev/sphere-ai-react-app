import { useState, useEffect } from 'react';
import Page from 'components/Page';
import { Stack } from '@material-ui/core';
import SearchBar from 'components/common/SearchBar';
import { useSnackbar } from 'notistack5';
import axios from 'utils/axios';
import { LoadingContainer } from 'pages/references/Common';
import LoadingScreen from 'components/LoadingScreen';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchResultCard from './SearchResultCard';
import { Loader } from './Common';

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>([]);
  const [totalPdfs, setTotalPdfs] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getData = async () => {
      await getQueryResults();
    };
    results.length < 10 && searchQuery && !isLoading && getData();
  }, [results]);

  const getQueryResults = async () => {
    await axios
      .get(`/documents/search.json?query=${searchQuery}&offset=${offset}`)
      .then((res) => {
        setResults([...results, ...res.data?.result]);
        setTotalPdfs(res.data?.total_documents);
        setOffset(res.data?.offset);
      })
      .catch((error: any) => enqueueSnackbar(error.message, { variant: 'error' }));
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      enqueueSnackbar("Query can't be empty!", { variant: 'warning' });
      return;
    }
    setIsSearching(true);
    await getQueryResults();
    setIsSearching(false);
  };

  const handleLoadMore = async () => {
    if (!searchQuery) {
      enqueueSnackbar("Query can't be empty!", { variant: 'warning' });
      return;
    }
    setIsLoading(true);
    await getQueryResults();
    setIsLoading(false);
  };

  return (
    <Page title="Sphere | Search">
      <Stack spacing={4} p="0 50px" mb="50px">
        <SearchBar
          submitHandler={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          disableButton={isSearching || isLoading || !searchQuery}
          placeHolder="Search"
        />
        {isSearching ? (
          <LoadingContainer>
            <LoadingScreen />
          </LoadingContainer>
        ) : (
          results.length > 0 && (
            <InfiniteScroll
              next={handleLoadMore}
              hasMore={offset < totalPdfs}
              dataLength={results.length}
              loader={<Loader />}
              style={{ overflow: 'unset' }}
            >
              <Stack spacing={4} p="0 50px" mb="50px">
                {results.map((result: any) => (
                  <SearchResultCard
                    key={result.id}
                    searchResult={result}
                    searchQuery={searchQuery}
                  />
                ))}
              </Stack>
            </InfiniteScroll>
          )
        )}
      </Stack>
    </Page>
  );
}
