import { memo, useState } from 'react';
import LoadingScreen from 'components/LoadingScreen';
import { Button, Stack, Typography, Card } from '@material-ui/core';
import axios from 'utils/axios';
import { HubspotReference, SearchBar, LoadingContainer } from './Common';

function ShowHubspotReference({
  reference,
  setReference
}: {
  reference: HubspotReference | null;
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
        `hubspot_references/${reference?.id}/query?query=${query}`
      );
      console.log('Response:', response.data);
      setQueryResult(response.data?.result?.results);
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
          {reference?.name}
        </Typography>
      </Stack>
      <SearchBar
        referenceType="HubSpot"
        searchQuery={query}
        setSearchQuery={setQuery}
        buttonFunction={handleSearch}
      />
      {isSearching && (
        <LoadingContainer>
          <LoadingScreen />
        </LoadingContainer>
      )}
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

export default memo(ShowHubspotReference);
