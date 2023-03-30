import { Theme, styled, Stack, Button, Box, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontWeight: 600,
    color: '#212B36'
  },
  publishDate: {
    color: '#637381'
  }
}));

export const SearchCard = styled(Stack)(({ theme }) => ({
  padding: '30px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0px 8px 16px rgba(145, 158, 171, 0.24)'
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  minWidth: '135px'
}));

export const StyledListItem = styled('li')(({ theme }) => ({
  marginLeft: '18px',
  color: '#212B36',
  marginBottom: '15px',
  [theme.breakpoints.down('md')]: {
    marginBottom: '30px'
  }
}));

export const MainText = styled(Typography)(({ theme }) => ({
  color: '#212B36',
  WebkitLineClamp: 1,
  display: '-webkit-inline-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  wordBreak: 'break-all',
  [theme.breakpoints.down('md')]: {
    WebkitLineClamp: 3
  }
}));

export const Loader = () => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
    <CircularProgress />
  </Box>
);
