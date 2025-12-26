import React, { useMemo, useState } from "react";
import { createReservation } from "../api.js";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const TIME_SLOTS = [
  "13:00","13:30","14:00","14:30","15:00","15:30",
  "20:00","20:30","21:00","21:30","22:00","22:30","23:00"
];

export default function Reserve() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    reservation_date: todayISO(),
    reservation_time: "20:00",
    party_size: 2,
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const canSubmit = useMemo(() => {
    return form.name.trim().length >= 2 &&
      form.phone.trim().length >= 7 &&
      /.+@.+\..+/.test(form.email) &&
      form.reservation_date &&
      form.reservation_time &&
      Number(form.party_size) >= 1;
  }, [form]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = { ...form, party_size: Number(form.party_size) };
      const data = await createReservation(payload);
      setResult(data);
    } catch (err) {
      setResult({ error: "No se pudo enviar la reserva." });
    } finally {
      setLoading(false);
    }
  }

  function update(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <h1 style={{ margin: "8px 0 12px" }}>Reservar mesa</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Nombre</span>
          <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Tu nombre"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Teléfono</span>
          <input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="Móvil"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input value={form.email} onChange={e => update("email", e.target.value)} placeholder="correo@ejemplo.com"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Fecha</span>
            <input type="date" value={form.reservation_date} onChange={e => update("reservation_date", e.target.value)}
              style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Hora</span>
            <select value={form.reservation_time} onChange={e => update("reservation_time", e.target.value)}
              style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }}>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Personas</span>
          <input type="number" min="1" max="30" value={form.party_size}
            onChange={e => update("party_size", e.target.value)}
            style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Notas (opcional)</span>
          <textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Cumpleaños, trona, terraza..."
            style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd", minHeight: 90 }} />
        </label>

        <button disabled={!canSubmit || loading}
          style={{ padding: 14, borderRadius: 14, border: "none", background: "#111", color: "white", fontWeight: 700 }}>
          {loading ? "Enviando..." : "Enviar reserva"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 14, padding: 12, borderRadius: 14, border: "1px solid #eee" }}>
          {"ok" in result && result.ok && (
            <div>
              <div style={{ fontWeight: 700 }}>¡Reserva enviada!</div>
              <div style={{ color: "#333" }}>ID: {result.id}</div>
              <div style={{ color: "#333", marginTop: 6 }}>Te llegará un email de confirmación (si el SMTP está configurado).</div>
            </div>
          )}
          {result.error && (
            <div style={{ color: "#b00020" }}>
              Error: {result.error}
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: 14, color: "#666" }}>
        Si no recibes confirmación, revisa spam o llama al restaurante.
      </p>
    </div>
  );
}
