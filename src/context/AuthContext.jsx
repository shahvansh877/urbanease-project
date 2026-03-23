// Ex No: 3b — React Hooks: useContext, useReducer, useRef
//
// AuthContext provides global authentication state to every component
// in the app without prop-drilling.
//
// How it works:
//   1. useReducer manages auth state (user, token, isAuthenticated).
//   2. createContext + useContext let any component read/update that state.
//   3. useRef is demonstrated in HomePage to auto-focus the search input.

import { createContext, useContext, useEffect, useReducer } from 'react';
import { authApi } from '../lib/api';

// ── 1. Initial state ──────────────────────────────────────────────────────────
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

// ── 2. Reducer function ───────────────────────────────────────────────────────
// A reducer takes the current state + an action, and returns new state.
// This replaces multiple useState calls for related auth data.
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      // Persist to localStorage so refreshing the page keeps the session
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { user: null, token: null, isAuthenticated: false };
    case 'REFRESH_USER':
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user };
    default:
      return state;
  }
}

// ── 3. Create the context ─────────────────────────────────────────────────────
export const AuthContext = createContext(null);

// ── 4. Provider component ─────────────────────────────────────────────────────
// Wrap the whole app with <AuthProvider> so any child can call useAuth().
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper actions dispatched to the reducer
  const login = (user, token) => dispatch({ type: 'LOGIN', payload: { user, token } });
  const logout = () => dispatch({ type: 'LOGOUT' });

  useEffect(() => {
    const syncCurrentUser = async () => {
      if (!state.token) return;
      try {
        const response = await authApi.me(state.token);
        if (response?.user) {
          dispatch({ type: 'REFRESH_USER', payload: { user: response.user } });
        }
      } catch {
        dispatch({ type: 'LOGOUT' });
      }
    };

    syncCurrentUser();
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── 5. Custom hook for easy consumption ──────────────────────────────────────
// Any component can call:  const { isAuthenticated, user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
