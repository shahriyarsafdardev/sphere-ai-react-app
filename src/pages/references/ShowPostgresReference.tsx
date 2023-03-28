import { memo, useState } from 'react';
import { Button, Stack, Typography, Card } from '@material-ui/core';
import axios from 'utils/axios';
import { PostgresReference, SearchBar } from './Common';

function ShowPostgresReference({
  reference,
  setReference
}: {
  reference: PostgresReference | null;
  setReference: Function;
}) {
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);

  const handleSearch = () => {
    const getQuery = async () => {
      const response: any = await axios.get(
        `postgres_references/${reference?.id}/query?query=${query}`
      );
      console.log('Response:', response.data);
      setQueryResult(response.data?.result);
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
      {queryResult &&
        queryResult.map((response: any) => (
          <Card sx={{ padding: '20px' }} key={response.id}>
            <Stack spacing={1}>
              {Object.keys(response).map((item: any) => (
                <Typography key={item}>
                  {item}: {response[item]}
                </Typography>
              ))}
            </Stack>
          </Card>
        ))}
    </Stack>
  );
}

export default memo(ShowPostgresReference);
