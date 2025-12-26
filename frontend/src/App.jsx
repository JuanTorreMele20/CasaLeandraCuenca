import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Reserve from "./pages/Reserve.jsx";
import AdminLogin from "./pages/admin/Login.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <header style={{ position: "sticky", top: 0, background: "white", borderBottom: "1px solid #eee", padding: "12px 16px", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, maxWidth: 860, margin: "0 auto" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#111", fontWeight: 700 }}>Casa Leandra</Link>
          <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/reserve" style={{ textDecoration: "none" }}>Reservar</Link>
            <Link to="/admin" style={{ textDecoration: "none" }}>Staff</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "16px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <a
        href="/reserve"
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          bottom: 16,
          padding: "14px 16px",
          borderRadius: 14,
          background: "#111",
          color: "white",
          textAlign: "center",
          textDecoration: "none",
          fontWeight: 700,
          maxWidth: 860,
          margin: "0 auto"
        }}
      >
        Reservar mesa
      </a>
    </div>
  );
}
