import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './authSlice';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedName = localStorage.getItem('taskflow_user');
    if (storedName) {
      const userData = {
        uid: 'user-' + Date.now(),
        displayName: storedName,
        email: `${storedName.toLowerCase().replace(/\\s+/g, '')}@example.com`,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(storedName)}`,
      };
      setLocalUser(userData);
      dispatch(setUser(userData));
    }
    setLoading(false);
  }, [dispatch]);

  const login = (name) => {
    localStorage.setItem('taskflow_user', name);
    const userData = {
      uid: 'user-' + Date.now(),
      displayName: name,
      email: `${name.toLowerCase().replace(/\\s+/g, '')}@example.com`,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };
    setLocalUser(userData);
    dispatch(setUser(userData));
  };

  const logout = () => {
    localStorage.removeItem('taskflow_user');
    setLocalUser(null);
    dispatch(clearUser());
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
