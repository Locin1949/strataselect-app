import React, { useState } from 'react';

import { login } from '../api';

export default function Login() {
  const [committeeId, setCommitteeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const data = await login(committeeId, password);

      // Store user info (no token in your backend)
      localStorage.setItem('committeeUser', JSON.stringify(data));

      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid ID or password');
    }
  }

  return (
    <div className="login-container">
      <h2>Committee Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="committee-id">Committee ID</label>
        <input
          id="committee-id"
          type="text"
          value={committeeId}
          onChange={e => setCommitteeId(e.target.value)}
        />

        <label htmlFor="committee-password">Password</label>
        <input
          id="committee-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
