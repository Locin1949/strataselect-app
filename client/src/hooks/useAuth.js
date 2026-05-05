// client/src/hooks/useAuth.js
import { useCallback,useEffect, useState } from 'react';

import api from '../api/namespaced';

export default function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.auth.me();
        setProfile(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, logout]);

  const login = useCallback(async (committee_id, password) => {
    const data = await api.auth.login(committee_id, password);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    return data;
  }, []);

  return {
    token,
    profile,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };
}
