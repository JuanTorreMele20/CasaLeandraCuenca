const API_URL = import.meta.env.VITE_API_URL;

export async function createReservation(payload) {
  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function loginStaff(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getReservations(date, token) {
  const res = await fetch(`${API_URL}/api/admin/reservations?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
