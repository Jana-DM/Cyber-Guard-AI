import { createContext, useContext, useReducer } from 'react';
import { ROUTES } from '../constants/routes';

const initialState = {
  isAuthenticated: false,
  user: null,
  currentRoute: ROUTES.OVERVIEW,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        currentRoute: ROUTES.OVERVIEW,
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'NAVIGATE':
      return { ...state, currentRoute: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}