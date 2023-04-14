// material
import { styled } from '@material-ui/core/styles';
import { Box, Stack, Container, Typography } from '@material-ui/core';
// routes
import { Helmet } from 'react-helmet-async';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack5';
import { useCallback } from 'react';

import Page from '../../components/Page';
import { MHidden } from '../../components/@material-extend';
import { LoginForm } from '../../components/authentication/login';
import TwoFactorAuth from './TwoFactorAuth';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up('xl')]: {
    marginLeft: '50px',
    marginRight: '50px'
  }
}));

const SectionStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 900,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: 12,
  [theme.breakpoints.down('md')]: {
    marginBottom: 19
  }
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  marginBottom: '1rem',
  marginTop: 0,
  [theme.breakpoints.down('sm')]: {
    marginBottom: '1.5rem',
    marginTop: '1rem'
  }
}));

export default function Login() {
  const { authenticateWithGoogle, isAuthenticated, isLoggedIn } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const handleLoginSuccess = (response: any) => {
    authenticateWithGoogle(response, enqueueSnackbar);
  };

  const handleLoginError = () => enqueueSnackbar('Something went wrong!', { variant: 'error' });

  const renderContent = useCallback(() => {
    if (!isLoggedIn) {
      return (
        <>
          <LoginForm />
          <Box sx={{ marginTop: '24px' }}>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                Cross-Origin-Opener-Policy="same-origin-allow-popups"
              />
            </GoogleOAuthProvider>
          </Box>
        </>
      );
    }
    if (!isAuthenticated) {
      return <TwoFactorAuth />;
    }
    return <></>;
  }, [isLoggedIn, isAuthenticated]);

  return (
    <RootStyle title="Sphere | Login">
      <Helmet>
        <link rel="canonical" href="https://portal.getsphere.com" />
      </Helmet>
      <MHidden width="mdDown">
        <SectionStyle>
          <img
            src="https://sphere-public.s3.eu-west-2.amazonaws.com/assets/sphere_home.png"
            alt="login"
            style={{ width: '700px' }}
          />
        </SectionStyle>
      </MHidden>

      <StyledContainer maxWidth="sm">
        <ContentStyle>
          <MHidden width="mdUp">
            <img src="/static/sphere_with_logo.svg" alt="login" width={140} />
          </MHidden>
          <StyledStack direction="row" alignItems="center">
            <Box sx={{ flexGrow: 1 }}>
              <Title gutterBottom>Welcome to the Sphere Portal</Title>
              <Typography sx={{ color: 'text.secondary' }}>
                Sphere's portal can be used to access your cohort content, network and messages at
                any time!
              </Typography>
            </Box>
          </StyledStack>
          {renderContent()}
        </ContentStyle>
      </StyledContainer>
    </RootStyle>
  );
}
