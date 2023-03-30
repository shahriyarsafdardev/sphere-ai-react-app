import { Theme, styled, Stack, Button, Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontWeight: 600,
    color: '#212B36'
  },
  publishDate: {
    color: '#637381'
  },
  mainText: {
    color: '#212B36',
    WebkitLineClamp: 1,
    display: '-webkit-inline-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    maxHeight: '30px',
    wordBreak: 'break-all'
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
  marginLeft: '30px',
  color: '#212B36',
  marginBottom: '15px',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '20px'
  }
}));

export const Loader = () => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
    <CircularProgress />
  </Box>
);
