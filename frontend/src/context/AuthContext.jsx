import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try { return saved && localStorage.getItem('token') && localStorage.getItem('token') !== 'demo_jwt_token' ? JSON.parse(saved) : null; } catch { return null; }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const loginUser = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updated = { ...user, rol: newRole };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
