import React, { useEffect, useMemo, useState } from "react";
import { getReservations } from "../../api.js";
import { Link, useNavigate } from "react-router-dom";

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const [date, setDate] = useState(todayISO());
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => localStorage.getItem("staff_token"), []);

  useEffect(() => {
    if (!token) nav("/admin/login");
  }, [token, nav]);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await getReservations(date, token);
      if (res.error) setErr(res.error);
      else setData(res);
    } catch {
      setErr("No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (token) load(); }, [date, token]);

  function logout() {
    localStorage.removeItem("staff_token");
    nav("/admin/login");
  }

  const reservations = data?.reservations || [];

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: "8px 0 12px" }}>Reservas · {date}</h1>
        <button onClick={logout} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd", background: "white" }}>
          Salir
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Fecha</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ padding: 10, borderRadius: 12, border: "1px solid #ddd" }} />
        </label>
        <Link to="/admin/login" style={{ textDecoration: "none", color: "#111" }} />
      </div>

      {loading && <div>Cargando…</div>}
      {err && <div style={{ color: "#b00020" }}>{err}</div>}

      {!loading && !err && (
        <div style={{ display: "grid", gap: 10 }}>
          {reservations.length === 0 && (
            <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 14 }}>No hay reservas para este día.</div>
          )}
          {reservations.map(r => (
            <div key={r.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{String(r.reservation_time).slice(0,5)}</div>
                <div style={{ fontSize: 12, padding: "4px 8px", borderRadius: 999, border: "1px solid #ddd" }}>{r.status}</div>
              </div>
              <div style={{ marginTop: 6, fontWeight: 700 }}>{r.name} · {r.party_size} pax</div>
              <div style={{ marginTop: 4, color: "#333" }}>
                <a href={`tel:${r.phone}`} style={{ textDecoration: "none" }}>{r.phone}</a> · {r.email}
              </div>
              {r.notes && <div style={{ marginTop: 6, color: "#555" }}>{r.notes}</div>}
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: 14, color: "#666" }}>
        Nota: en esta versión el dashboard solo lista. En el siguiente paso añadimos crear/editar/cambiar estado desde aquí.
      </p>
    </div>
  );
}
