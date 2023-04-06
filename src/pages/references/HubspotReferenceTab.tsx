import { useState, useEffect } from 'react';
import axios from 'utils/axios';
import Page from 'components/Page';
import { Typography, Stack } from '@material-ui/core';
import { StyledCard, HubspotReference } from './Common';
import ReferenceShowPage from './ReferenceShowPage';

export default function HubspotReferenceTab() {
  const [currentReference, setCurrentReference] = useState<HubspotReference | null>(null);
  const [references, setReferences] = useState<HubspotReference[]>([]);

  useEffect(() => {
    const getReferences = async () => {
      const response: any = await axios.get('/hubspot_references.json');
      setReferences(response.data);
    };
    getReferences();
  }, []);

  return (
    <Page title="Sphere | HubSpot References" sx={{ padding: '0 50px' }}>
      {currentReference ? (
        <ReferenceShowPage
          reference={currentReference}
          setReference={setCurrentReference}
          referenceType="HubSpot"
        />
      ) : (
        references.map((reference: HubspotReference) => (
          <StyledCard key={reference.id} onClick={() => setCurrentReference(reference)}>
            <Stack spacing={1}>
              <Typography variant="h4">{reference.name}</Typography>
              <Typography>Environment: {reference.environment}</Typography>
            </Stack>
          </StyledCard>
        ))
      )}
    </Page>
  );
}
