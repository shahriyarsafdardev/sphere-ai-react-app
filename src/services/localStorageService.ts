const LocalStorageService = {
  getAccessToken: () => localStorage.getItem('accessToken') || '',
  setAccessToken: (value: string) => localStorage.setItem('accessToken', value)
};
export default LocalStorageService;
