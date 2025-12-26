import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ paddingBottom: 80 }}>
      <h1 style={{ fontSize: 32, lineHeight: 1.1, margin: "10px 0" }}>Casa Leandra</h1>
      <p style={{ fontSize: 16, color: "#333" }}>
        Reserva tu mesa en segundos (móvil primero). Confirmación por email.
      </p>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #eee", borderRadius: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Horario</h2>
        <p style={{ margin: "8px 0 0", color: "#333" }}>
          Comidas: 13:00–16:00 · Cenas: 20:00–23:30
        </p>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <Link to="/reserve" style={{ display: "block", padding: 14, borderRadius: 14, background: "#111", color: "white", textDecoration: "none", fontWeight: 700, textAlign: "center" }}>
          Reservar ahora
        </Link>
        <a href="tel:+34000000000" style={{ display: "block", padding: 14, borderRadius: 14, border: "1px solid #ddd", textDecoration: "none", textAlign: "center" }}>
          Llamar al restaurante
        </a>
        <a href="mailto:casaleandracuenca@gmail.com" style={{ display: "block", padding: 14, borderRadius: 14, border: "1px solid #ddd", textDecoration: "none", textAlign: "center" }}>
          Enviar email
        </a>
      </div>
    </div>
  );
}
