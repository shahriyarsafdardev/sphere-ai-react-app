const LocalStorageService = {
  getAccessToken: () => localStorage.getItem('accessToken') || '',
  setAccessToken: (value: string) => localStorage.setItem('accessToken', value),
  removeAccessToken: () => localStorage.removeItem('accessToken')
};
export default LocalStorageService;
