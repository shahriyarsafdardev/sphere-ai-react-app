import { useContext } from 'react';
import axios from 'axios';
import LocalStorageService from 'services/localStorageService';
import { ROOT_URL } from '../routes/paths';
import { setSession } from './jwt';
import { AuthContext } from '../contexts/JWTContext';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: ROOT_URL
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const sphereAiAccessToken = LocalStorageService.getAccessToken();
    if (sphereAiAccessToken) {
      config.headers.Authorization = `Bearer ${sphereAiAccessToken}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    if (error.config.url !== '/login/' && error.response) {
      if (error.response.status === 401) {
        await axiosInstance
          .post('/login/refresh/', {
            refresh: LocalStorageService.getRefreshToken()
          })
          .then((res: any) => {
            const { access } = res.data;
            LocalStorageService.setAccessToken(access);
            return axiosInstance(error.config);
          })
          .catch((err: any) => {
            setSession(null);
            useContext(AuthContext)?.setIsNotAuthenticated();
            Promise.reject((err.response && err.response.data) || 'Something went wrong!');
          });
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
  }
);

export default axiosInstance;
