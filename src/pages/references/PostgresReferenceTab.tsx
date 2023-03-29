import { useState, useEffect } from 'react';
import axios from 'utils/axios';
import Page from 'components/Page';
import { Stack, Typography } from '@material-ui/core';
import { StyledCard, PostgresReference } from './Common';
import ReferenceShowPage from './ReferenceShowPage';

export default function PostgresReferenceTab() {
  const [currentReference, setCurrentReference] = useState<PostgresReference | null>(null);
  const [references, setReferences] = useState<PostgresReference[]>([]);

  useEffect(() => {
    const getReferences = async () => {
      const response: any = await axios.get('/postgres_references/my_references.json');
      setReferences(response.data);
    };
    getReferences();
  }, []);

  return (
    <Page sx={{ padding: '0 50px' }}>
      {currentReference ? (
        <ReferenceShowPage
          referenceType="Postgres"
          reference={currentReference}
          setReference={setCurrentReference}
        />
      ) : (
        references.map((reference: PostgresReference) => (
          <StyledCard key={reference.id} onClick={() => setCurrentReference(reference)}>
            <Stack spacing={1}>
              <Typography variant="h4">{reference.title}</Typography>
              <Typography>Database name: {reference.db_name}</Typography>
              <Typography>Database user name: {reference.db_user_name}</Typography>
            </Stack>
          </StyledCard>
        ))
      )}
    </Page>
  );
}
