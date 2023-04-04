// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '';
export const ROOT_URL = process.env.REACT_APP_ROOT_URL;

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetUserPassword: path(ROOTS_AUTH, '/first-login'),
  unlockUser: path(ROOTS_AUTH, '/unlock-user'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: '/',
  chat: {
    chatbot: path(ROOTS_DASHBOARD, '/chatbot')
  },
  user: {
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  sidebar: {
    postgres: path(ROOTS_DASHBOARD, '/postgres-references'),
    hubspot: path(ROOTS_DASHBOARD, '/hubspot-references'),
    search: path(ROOTS_DASHBOARD, '/search')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
