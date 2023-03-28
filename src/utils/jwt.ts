import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
//
import LocalStorageService from 'services/localStorageService';
import axios from './axios';

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    LocalStorageService.setAccessToken(accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    LocalStorageService.removeAccessToken();
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession, verify, sign };
