import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { signToken, requireAuth } from "../auth.js";

const r = Router();

r.post("/auth/login", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid data" });

  const { email, password } = parsed.data;

  const { rows } = await pool.query("SELECT id,email,password_hash,role FROM staff_users WHERE email=$1", [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token, role: user.role });
});

r.get("/admin/reservations", requireAuth, async (req, res) => {
  const date = req.query.date;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: "date required" });

  const { rows } = await pool.query(
    `SELECT * FROM reservations
     WHERE reservation_date=$1
     ORDER BY reservation_time ASC`,
    [date]
  );

  res.json({ reservations: rows });
});

r.post("/admin/reservations", requireAuth, async (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email(),
    reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reservation_time: z.string().regex(/^\d{2}:\d{2}$/),
    party_size: z.number().int().min(1).max(30),
    notes: z.string().max(500).optional().default(""),
    status: z.enum(["pending","confirmed","cancelled","no_show","seated"]).optional().default("confirmed"),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });

  const d = parsed.data;

  const { rows } = await pool.query(
    `INSERT INTO reservations (name, phone, email, reservation_date, reservation_time, party_size, notes, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [d.name, d.phone, d.email, d.reservation_date, d.reservation_time, d.party_size, d.notes, d.status]
  );

  res.status(201).json({ reservation: rows[0] });
});

r.patch("/admin/reservations/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

  const schema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(7).optional(),
    email: z.string().email().optional(),
    reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    reservation_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    party_size: z.number().int().min(1).max(30).optional(),
    notes: z.string().max(500).optional(),
    status: z.enum(["pending","confirmed","cancelled","no_show","seated"]).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid data" });

  const fields = parsed.data;
  const keys = Object.keys(fields);
  if (keys.length === 0) return res.status(400).json({ error: "No fields" });

  const set = keys.map((k, i) => `${k}=$${i + 1}`).join(", ");
  const values = keys.map((k) => fields[k]);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE reservations SET ${set}, updated_at=now() WHERE id=$${values.length} RETURNING *`,
    values
  );

  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json({ reservation: rows[0] });
});

r.delete("/admin/reservations/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { rowCount } = await pool.query("DELETE FROM reservations WHERE id=$1", [id]);
  res.json({ ok: true, deleted: rowCount === 1 });
});

export default r;
