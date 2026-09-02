import { useState } from "react";
import api from "../services/api";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="brand">
          <img src="/logo.png" alt="ShopSphere Logo" />
          <h1>ShopSphere</h1>
          <p>Online Shopping · Admin Panel</p>
        </div>

        <h2>Admin Login</h2>

        <form onSubmit={login}>
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}
