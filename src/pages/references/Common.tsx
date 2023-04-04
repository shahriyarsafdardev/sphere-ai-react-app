import { Card, styled, Typography, Box } from '@material-ui/core';

export type PostgresReference = {
  id: string;
  title: string;
  db_name: string;
  db_user_name: string;
  host: string;
};

export type HubspotReference = {
  id: string;
  name: string;
  environment: string;
  user_id: string;
};

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: '30px',
  marginBottom: '30px',
  cursor: 'pointer'
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '30px'
}));

export const LoadingContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%'
}));
