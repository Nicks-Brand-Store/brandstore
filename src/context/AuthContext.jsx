import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const AUTH_USER_KEY = 'brand-store-auth';
const AUTH_USERS_KEY = 'brand-store-users';

const defaultUsers = [
  { email: 'admin@brandstore.com', password: 'admin123', role: 'admin' },
  { email: 'customer@example.com', password: 'customer123', role: 'customer' },
];

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = window.localStorage.getItem(AUTH_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [users, setUsers] = useState(() => {
    const stored = window.localStorage.getItem(AUTH_USERS_KEY);
    return stored ? JSON.parse(stored) : defaultUsers;
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  }, [users]);

  const login = (email, password) => {
    const normalized = email.trim().toLowerCase();
    const found = users.find(
      (account) => account.email === normalized && account.password === password
    );

    if (!found) return null;

    const loggedInUser = { email: found.email, role: found.role };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = (email, password) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password.trim()) {
      return { error: 'Email and password are required.' };
    }

    if (users.some((account) => account.email === normalized)) {
      return { error: 'This email is already registered. Please log in.' };
    }

    const role = normalized.endsWith('@brandstore.com') ? 'admin' : 'customer';
    const newUser = { email: normalized, password: password.trim(), role };
    setUsers((current) => [...current, newUser]);

    const loggedInUser = { email: newUser.email, role: newUser.role };
    setUser(loggedInUser);
    return { user: loggedInUser };
  };

  const logout = () => setUser(null);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
}
