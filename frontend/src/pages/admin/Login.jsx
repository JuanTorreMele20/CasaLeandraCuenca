import React, { useState } from "react";
import { loginStaff } from "../../api.js";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await loginStaff(email, password);
      if (data.token) {
        localStorage.setItem("staff_token", data.token);
        nav("/admin");
      } else {
        setErr(data.error || "No se pudo iniciar sesión.");
      }
    } catch {
      setErr("No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <h1 style={{ margin: "8px 0 12px" }}>Staff · Login</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
        </label>
        <button disabled={loading} style={{ padding: 14, borderRadius: 14, border: "none", background: "#111", color: "white", fontWeight: 700 }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {err && <div style={{ color: "#b00020" }}>{err}</div>}
      </form>
    </div>
  );
}
