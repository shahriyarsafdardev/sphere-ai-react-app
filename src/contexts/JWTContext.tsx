import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from 'axios';
import LocalStorageService from 'services/localStorageService';
import moment from 'moment';
import axiosV1 from '../utils/axios';
import { ParticipantProfile } from '../@types/user';
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
          verified2FADate && moment().subtract(3, 'minutes') <= moment(verified2FADate);

        if (sphereAiAccessToken && is2FAValid) {
          setSession(sphereAiAccessToken);

          const response = await axiosV1.get('/users/my_account.json');
          const { user } = response.data;
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
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

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${ROOT_URL}/users/sign_in`, {
      user: { email, password }
    });
    const sphereAiAccessToken = response.headers.authorization;
    const { user } = response.data;

    setSession(sphereAiAccessToken);
    dispatch({
      type: Types.Login,
      payload: {
        user
      }
    });
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    role: string,
    company: string
  ) => {
    const response = await axiosV1.post('/users/register', {
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
    const sphereAiAccessToken = LocalStorageService.getAccessToken();
    await axios
      .delete(`${ROOT_URL}/users/sign_out`, { headers: { Authorization: sphereAiAccessToken } })
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

  const updateProfile = async (user: ParticipantProfile) => {
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
        // user
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
        setIsAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
