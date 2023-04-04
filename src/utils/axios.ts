import axios from 'axios';
import LocalStorageService from 'services/localStorageService';
import { ROOT_URL } from '../routes/paths';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: ROOT_URL
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const sphereAiAccessToken = LocalStorageService.getAccessToken();
    if (sphereAiAccessToken) {
      config.headers.Authorization = sphereAiAccessToken;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
