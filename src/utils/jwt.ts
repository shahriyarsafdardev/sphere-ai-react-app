import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
//
import LocalStorageService from 'services/localStorageService';
import axios from './axios';

// ----------------------------------------------------------------------

const isValidToken = (sphereAiAccessToken: string) => {
  if (!sphereAiAccessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(sphereAiAccessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (sphereAiAccessToken: string | null) => {
  if (sphereAiAccessToken) {
    LocalStorageService.setAccessToken(sphereAiAccessToken);
    axios.defaults.headers.common.Authorization = sphereAiAccessToken;
  } else {
    LocalStorageService.removeAccessToken();
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession, verify, sign };
