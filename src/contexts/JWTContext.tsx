import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from 'axios';
import LocalStorageService from 'services/localStorageService';
import moment from 'moment';
import axiosV1 from '../utils/axios';
import { setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/authentication';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
  Authenticate = 'AUTHENTICATE'
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
    isLoggedIn: boolean;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
  [Types.Authenticate]: { isAuthenticated: boolean };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  isLoggedIn: false,
  user: null
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  let newUser: AuthUser;
  switch (action.type) {
    case 'INITIALIZE':
      newUser = action.payload.user;
      newUser = {
        ...newUser,
        displayName: `${newUser?.first_name} ${newUser?.last_name}`,
        photoURL: newUser?.profile_image_url
      };
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: newUser,
        isLoggedIn: action.payload.isLoggedIn
      };
    case 'LOGIN':
      newUser = action.payload.user;
      newUser = {
        ...newUser,
        displayName: `${newUser?.first_name} ${newUser?.last_name}`,
        photoURL: newUser?.profile_image_url
      };
      return {
        ...state,
        isAuthenticated: false,
        user: newUser,
        isLoggedIn: true
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoggedIn: false
      };

    case 'REGISTER':
      newUser = action.payload.user;
      newUser = {
        ...newUser,
        displayName: `${newUser?.first_name} ${newUser?.last_name}`,
        photoURL: newUser?.profile_image_url
      };
      return {
        ...state,
        user: newUser
      };

    case 'AUTHENTICATE':
      return {
        ...state,
        isAuthenticated: true
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const ROOT_URL = process.env.REACT_APP_ROOT_URL?.split('/api/')?.[0];

  useEffect(() => {
    const initialize = async () => {
      try {
        const sphereAiAccessToken = LocalStorageService.getAccessToken();
        const verified2FADate = LocalStorageService.get2FAVerificationDate();
        const is2FAValid =
          verified2FADate && moment().subtract(2, 'days') <= moment(verified2FADate);

        if (sphereAiAccessToken) {
          setSession(sphereAiAccessToken);
          const response = await axiosV1.get('/users/my_account/');
          const user = response.data;
          is2FAValid && LocalStorageService.save2FAVerificationDate();
          const authenticated = !!is2FAValid && user.is_otp_enabled;

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: authenticated,
              user,
              isLoggedIn: true
            }
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
              isLoggedIn: false
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
            isLoggedIn: false
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string, enqueueSnackbar?: any) => {
    await axios
      .post(`${ROOT_URL}/login/`, {
        user: { email, password }
      })
      .then((response) => {
        const sphereAiAccessToken = response?.headers?.authorization;
        if (sphereAiAccessToken) {
          const user = response.data;
          setSession(sphereAiAccessToken);
          dispatch({
            type: Types.Login,
            payload: {
              user
            }
          });
          enqueueSnackbar('Logged in successfully!', { variant: 'success' });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: 'error' });
        }
      })
      .catch((error) => {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      });
  };

  const authenticateWithGoogle = (response: any, enqueueSnackbar?: any) => {
    const token = response.credential;
    axios
      .post(
        `${ROOT_URL}/users/auth/google_oauth2/callback.json`,
        {
          token
        },
        {
          headers: {
            Authorization: `Bearer ${response.credential}`,
            'Content-Type': 'application/json',
            access_token: `${response.credential}`
          }
        }
      )
      .then((response) => {
        const accessToken = response.headers.authorization;
        if (accessToken) {
          const { user } = response.data;
          setSession(accessToken);
          dispatch({
            type: Types.Login,
            payload: {
              user
            }
          });
          enqueueSnackbar('Logged in successfully!', { variant: 'success' });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: 'error' });
        }
      })
      .catch((error) => {
        enqueueSnackbar(error.message || 'Something went wrong!', { variant: 'error' });
      });
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    role: string,
    company: string
  ) => {
    const response = await axiosV1.post('/users/', {
      email,
      password,
      fullName,
      role,
      current_company: company
    });
    const { sphereAiAccessToken, user } = response.data;

    LocalStorageService.setAccessToken(sphereAiAccessToken);
    dispatch({
      type: Types.Register,
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    const sphereAiRefreshToken = LocalStorageService.getRefreshToken();
    await axios
      .delete(`${ROOT_URL}/logout/`, {
        headers: { refresh_token: sphereAiRefreshToken }
      })
      .then((res) => {
        setSession(null);
        LocalStorageService.remove2FAVerificationDate();
        dispatch({ type: Types.Logout });
      });
  };

  const resetPassword = async (email: string) => {
    await axiosV1.post(`/users/reset_password`, {
      email
    });
  };

  const updatePassword = async (password: string, reset_password_token: string | null) => {
    await axiosV1.post(`/users/update_password.json`, {
      password,
      reset_password_token
    });
  };

  const updateProfile = async (user: Record<string, any>) => {
    const { user: stateUser } = state;
    // only update the new fields, and keep old data as it is
    user = { ...stateUser, ...user };

    dispatch({
      type: Types.Initial,
      payload: {
        isAuthenticated: true,
        user,
        isLoggedIn: true
      }
    });
  };

  const setIsAuthenticated = () =>
    dispatch({
      type: Types.Authenticate,
      payload: {
        isAuthenticated: true
      }
    });

  const setIsNotAuthenticated = () =>
    dispatch({
      type: Types.Authenticate,
      payload: {
        isAuthenticated: false
      }
    });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
        updatePassword,
        setIsAuthenticated,
        setIsNotAuthenticated,
        authenticateWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
