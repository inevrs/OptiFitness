import React, { createContext, useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zf_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check for token passed from App Inventor via URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const queryToken = urlParams.get('token');
      let activeToken = token;

      if (queryToken) {
        localStorage.setItem('zf_token', queryToken);
        activeToken = queryToken;
        setToken(queryToken);
        // Clear the token from URL bar cleanly
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (activeToken) {
        try {
          const userData = await apiGet('/profile');
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.warn('Auth check failed (is backend running?):', error.message);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []); // Only run on mount, not on token change to avoid loops

  const login = async (username, password) => {
    try {
      const data = await apiPost('/login', { username, password });
      localStorage.setItem('zf_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await apiPost('/register', formData);
      localStorage.setItem('zf_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('zf_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
