import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('contractiq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('contractiq_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('contractiq_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('contractiq_token', data.access_token);
    setToken(data.access_token);
    setUser({
      id: data.user_id,
      organization_id: data.organization_id,
      name: data.name,
      email: data.email,
      role: data.role
    });
    localStorage.setItem('contractiq_user', JSON.stringify({
      id: data.user_id,
      organization_id: data.organization_id,
      name: data.name,
      email: data.email,
      role: data.role
    }));
    return data;
  };

  const register = async (name, company_name, email, password, industry) => {
    const res = await api.post('/auth/register', { name, company_name, email, password, industry });
    const data = res.data;
    localStorage.setItem('contractiq_token', data.access_token);
    setToken(data.access_token);
    setUser({
      id: data.user_id,
      organization_id: data.organization_id,
      name: data.name,
      email: data.email,
      role: data.role
    });
    localStorage.setItem('contractiq_user', JSON.stringify({
      id: data.user_id,
      organization_id: data.organization_id,
      name: data.name,
      email: data.email,
      role: data.role
    }));
    return data;
  };

  const seedDemoData = async () => {
    if (token) {
      await api.post('/demo/seed');
    }
  };

  const logout = () => {
    localStorage.removeItem('contractiq_token');
    localStorage.removeItem('contractiq_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, seedDemoData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
