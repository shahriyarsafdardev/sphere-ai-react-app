const LocalStorageService = {
  getAccessToken: () => localStorage.getItem('sphereAiAccessToken') || '',
  setAccessToken: (value: string) => localStorage.setItem('sphereAiAccessToken', value),
  removeAccessToken: () => localStorage.removeItem('sphereAiAccessToken')
};
export default LocalStorageService;
