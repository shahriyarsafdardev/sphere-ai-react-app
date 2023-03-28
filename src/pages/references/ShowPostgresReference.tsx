import { memo, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { Button, Stack, Typography } from '@material-ui/core';
import axios from 'utils/axios';
import { PostgresReference, SearchBar, LoadingContainer } from './Common';
import ResultTable from './ResultTable';

function ShowPostgresReference({
  reference,
  setReference
}: {
  reference: PostgresReference | null;
  setReference: Function;
}) {
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setQueryResult(null);
    const getQuery = async () => {
      const response: any = await axios.get(
        `postgres_references/${reference?.id}/query?query=${query}`
      );
      console.log('Response:', response.data);
      setQueryResult(response.data?.result);
      setIsSearching(false);
    };
    getQuery();
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center">
        <Button variant="text" onClick={() => setReference(null)}>
          {'< Back'}
        </Button>
        <Typography variant="h4" sx={{ width: '100%', textAlign: 'center' }}>
          {reference?.title}
        </Typography>
      </Stack>
      <SearchBar
        referenceType="Postgres"
        searchQuery={query}
        setSearchQuery={setQuery}
        buttonFunction={handleSearch}
      />
      {isSearching && (
        <LoadingContainer>
          <LoadingScreen />
        </LoadingContainer>
      )}
      {queryResult && <ResultTable queryResult={queryResult} />}
    </Stack>
  );
}

export default memo(ShowPostgresReference);
