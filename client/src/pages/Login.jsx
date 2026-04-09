import React, { useState } from "react";
import { login } from "../api";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    console.log("LOGIN CLICKED", id, password);

    try {
      const data = await login(id, password);
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid ID or password");
    }
  }

  return (
    <div className="login-container">
      <h2>Committee Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} autoComplete="off">
        
        <label htmlFor="committee-id">Committee ID</label>
        <input
          id="committee-id"
          name="committee-id"
          type="text"
          autoComplete="off"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <label htmlFor="committee-password">Password</label>
        <input
          id="committee-password"
          name="committee-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}