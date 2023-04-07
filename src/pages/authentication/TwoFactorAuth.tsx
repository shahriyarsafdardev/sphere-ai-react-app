import { useEffect, useState } from 'react';
import { Theme, Stack, Typography, Button, Box, CircularProgress } from '@material-ui/core';
import ReactInputCode from 'react-input-code';
import 'react-input-code/dist/index.css';

import QRCode from 'react-qr-code';
import useAuth from 'hooks/useAuth';
import { styled } from '@material-ui/core/styles';

import { useSnackbar } from 'notistack5';
import axios from 'utils/axios';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import LocalStorageService from 'services/localStorageService';
import { makeStyles } from '@material-ui/styles';
import { MIconButton } from '../../components/@material-extend';

const useStyles = makeStyles((theme: Theme) => ({
  code: {
    justifyContent: 'center !important'
  },
  codeItem: {
    fontWeight: 600,
    fontSize: '24px',
    color: '#212B36',
    width: 56,
    height: 56,
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      width: 45,
      height: 45
    }
  }
}));

const StyledCircularLoader = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
}));

export default function TwoFactorAuth() {
  const { user, updateProfile, setIsAuthenticated, logout } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [QRCodeImage, setQRCodeImage] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (!!user && !user?.is_otp_enabled) {
      setLoading(true);
      axios
        .post('/otp_secrets.json')
        .then((response) => {
          setQRCodeImage(response.data.qr_link);
          setLoading(false);
        })
        .catch((error) => {
          enqueueSnackbar('Something went wrong!', { variant: 'error' });
          setLoading(false);
        });
    }
  }, []);

  const verifyCode = () => {
    axios
      .post(`/otp_secrets/verify.json`, {
        otp_code: inputValue
      })
      .then((response) => {
        setIsAuthenticated();
        updateProfile({ ...user, is_otp_enabled: true });
        LocalStorageService.save2FAVerificationDate();
        enqueueSnackbar('Successfully verified!', { variant: 'success' });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
  };

  return (
    <Stack alignItems="center" spacing={3}>
      {loading ? (
        <StyledCircularLoader>
          <CircularProgress />
        </StyledCircularLoader>
      ) : (
        <>
          {QRCodeImage ? (
            <>
              <Typography sx={{ color: 'text.secondary' }}>
                Scan the code below to add the Sphere AI app to your authenticator app
              </Typography>
              <Box
                sx={{
                  padding: '8px',
                  paddingBottom: '2px!important',
                  backgroundColor: '#fff',
                  borderRadius: '5px'
                }}
              >
                <QRCode value={QRCodeImage} size={150} viewBox="0 0 150 150" />
              </Box>
            </>
          ) : (
            <Typography sx={{ color: 'text.secondary', alignSelf: 'baseline' }}>
              Enter the code displayed on your authenticator app
            </Typography>
          )}
          <ReactInputCode
            value={inputValue}
            onChange={setInputValue}
            type="number"
            className={classes.code}
            itemClassName={classes.codeItem}
            nItems={6}
            autoFocus={true}
            placeholder="-"
          />
          <Stack spacing={1} width="100%">
            <Button fullWidth variant="contained" size="large" onClick={() => verifyCode()}>
              Verify
            </Button>
            <Button fullWidth variant="outlined" size="large" onClick={() => logout()}>
              Back
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}
