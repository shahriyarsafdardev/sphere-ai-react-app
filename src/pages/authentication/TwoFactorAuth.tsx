import { useState, useEffect } from 'react';
import { Button, Stack, TextField, Typography } from '@material-ui/core';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { QRCodeCanvas } from 'qrcode.react';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack5';
import axiosV1 from 'utils/axios';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import LocalStorageService from 'services/localStorageService';
import { MIconButton } from '../../components/@material-extend';

export default function TwoFactorAuth() {
  const { user, setIsAuthenticated, logout } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [QRCodeImage, setQRCodeImage] = useState('');
  const [data, setData] = useState<any>({
    hex: '',
    otpauth_url: ''
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      if (user.authenticator_hex) {
        setData({ ...data, hex: user.authenticator_hex });
      } else {
        const generatedSecret = speakeasy.generateSecret({ name: 'Sphere AI' });

        if (generatedSecret.otpauth_url) {
          QRCode.toDataURL(generatedSecret.otpauth_url, (err, image_data) => {
            setData(generatedSecret);
            setQRCodeImage(image_data);
          });
        }
      }
    }
  }, []);

  const verifyCode = () => {
    const isVerified = speakeasy.totp.verify({
      secret: data.hex,
      encoding: 'hex',
      token: inputValue,
      window: 1
    });

    if (isVerified) {
      enqueueSnackbar('Logged in successfully!', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      setIsAuthenticated();
      // if the user did not have a hex code, save the hex in the BE
      if (!user?.authenticator_hex) {
        axiosV1
          .patch(`/users/${user?.id}/set_authenticator_hex`, { authenticator_hex: data.hex })
          .catch((error) => console.log(error.message));
      }
      // save the date in local storage
      LocalStorageService.save2FAVerificationDate();
    } else {
      enqueueSnackbar('Incorrect code provided!', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    }
  };

  return (
    <Stack alignItems="center" spacing={3}>
      {QRCodeImage ? (
        <>
          <Typography sx={{ color: 'text.secondary' }}>
            Scan the code below to add the Sphere AI app to your authenticator app
          </Typography>
          <QRCodeCanvas
            value="Sphere AI"
            imageSettings={{ src: QRCodeImage, height: 100, width: 100, excavate: false }}
          />
        </>
      ) : (
        <Typography sx={{ color: 'text.secondary', alignSelf: 'baseline' }}>
          Enter the code displayed on your authenticator app
        </Typography>
      )}
      <TextField
        placeholder="Enter verification code"
        fullWidth
        onChange={(e: any) => setInputValue(e.target.value)}
      />
      <Stack spacing={1} width="100%">
        <Button fullWidth variant="contained" size="large" onClick={() => verifyCode()}>
          Verify
        </Button>
        <Button fullWidth variant="outlined" size="large" onClick={() => logout()}>
          Back
        </Button>
      </Stack>
    </Stack>
  );
}
