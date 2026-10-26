import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ati_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default logged in demo admin
    return {
      name: 'Academic Registrar',
      email: 'registrar@ati.edu.lk',
      role: 'Administrator',
      avatar: 'AR'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ati_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ati_auth_user');
      localStorage.removeItem('ati_auth_token');
    }
  }, [user]);

  const login = (email, password, role = 'Administrator') => {
    const newUser = {
      name: email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'ATI Officer',
      email,
      role,
      avatar: (email[0] || 'A').toUpperCase()
    };
    setUser(newUser);
    localStorage.setItem('ati_auth_token', 'mock_jwt_token_' + Date.now());
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
