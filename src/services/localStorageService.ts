const LocalStorageService = {
  getAccessToken: () => localStorage.getItem('sphereAiAccessToken') || '',
  setAccessToken: (value: string) => localStorage.setItem('sphereAiAccessToken', value),
  removeAccessToken: () => localStorage.removeItem('sphereAiAccessToken'),
  save2FAVerificationDate: () => localStorage.setItem('2FAVerifiedAt', new Date().toString()),
  get2FAVerificationDate: () => localStorage.getItem('2FAVerifiedAt'),
  remove2FAVerificationDate: () => localStorage.removeItem('2FAVerifiedAt')
};
export default LocalStorageService;
