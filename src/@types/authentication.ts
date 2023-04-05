import { ParticipantProfile } from './user';

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUser = null | Record<string, any>;

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  is2faVerified: boolean;
};

export type JWTContextType = {
  isAuthenticated: boolean;
  is2faVerified: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: 'jwt';
  login: (email: string, password: string, enqueueSnackbar?: any) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    role: string,
    company: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => void;
  updateProfile: (user: ParticipantProfile) => void;
  updatePassword: (password: string, reset_password_token: string | null) => Promise<void>;
  setIsAuthenticated: () => void;
  authenticateWithGoogle: (response: any, enqueueSnackbar?: any) => void;
  setIs2faVerified: () => void;
};
