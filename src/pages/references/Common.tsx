import {
  TextField,
  InputAdornment,
  Card,
  styled,
  Typography,
  Stack,
  IconButton,
  Box
} from '@material-ui/core';
import { memo } from 'react';
import searchFill from '@iconify/icons-eva/search-fill';
import { Icon } from '@iconify/react';

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

export const SearchBar = memo(
  ({
    searchQuery,
    setSearchQuery,
    referenceType,
    buttonFunction,
    disableButton
  }: {
    searchQuery: string;
    setSearchQuery: Function;
    referenceType: string;
    buttonFunction: Function;
    disableButton: boolean;
  }) => {
    const handleKeyDown = (e: any) => {
      if (e?.key === 'Enter' && !disableButton) {
        buttonFunction();
        e?.preventDefault();
      }
    };
    return (
      <Stack direction="row" alignItems="center">
        <TextField
          fullWidth
          placeholder={`Query your ${referenceType} database`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          InputProps={{
            style: { background: '#ffffff' },
            startAdornment: (
              <InputAdornment position="start">
                <Icon
                  style={{ marginLeft: '5px' }}
                  icon={searchFill}
                  width={25}
                  height={25}
                  color="#101658"
                />
              </InputAdornment>
            )
          }}
          color="primary"
        />
        <IconButton
          sx={{ width: '50px', height: '50px' }}
          onClick={() => buttonFunction()}
          disabled={disableButton}
        >
          <img width="24" src="/static/icons/ic-send.svg" alt="search" />
        </IconButton>
      </Stack>
    );
  }
);
