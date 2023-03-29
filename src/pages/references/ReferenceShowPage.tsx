import { memo, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { Button, Stack, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack5';
import axios from 'utils/axios';
import { SearchBar, LoadingContainer } from './Common';
import ResultTable from './ResultTable';

function ShowHubspotReference({
  reference,
  setReference,
  referenceType
}: {
  reference: any;
  setReference: Function;
  referenceType: string;
}) {
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSearch = () => {
    setIsSearching(true);
    setQueryResult(null);
    const getQuery = async () => {
      await axios
        .get(`${referenceType.toLowerCase()}_references/${reference?.id}/query?query=${query}`)
        .then((response) => {
          setQueryResult(response.data?.result);
        })
        .catch((error: any) => enqueueSnackbar(error.message, { variant: 'error' }));
      setIsSearching(false);
    };
    getQuery();
  };

  const renderResults = () => {
    if (isSearching) {
      return (
        <LoadingContainer>
          <LoadingScreen />
        </LoadingContainer>
      );
    }
    if (queryResult) {
      if (queryResult.length) {
        return <ResultTable queryResult={queryResult} />;
      }
      return <Typography>No results found</Typography>;
    }
    return <></>;
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center">
        <Button variant="text" onClick={() => setReference(null)}>
          {'< Back'}
        </Button>
        <Typography variant="h4" sx={{ width: '100%', textAlign: 'center' }}>
          {reference?.name}
        </Typography>
      </Stack>
      <SearchBar
        referenceType={referenceType}
        searchQuery={query}
        setSearchQuery={setQuery}
        buttonFunction={handleSearch}
        disableButton={isSearching}
      />
      {renderResults()}
    </Stack>
  );
}

export default memo(ShowHubspotReference);
