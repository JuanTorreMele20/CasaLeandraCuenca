import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { makeMailer } from "../email.js";

const r = Router();

const ReservationSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservation_time: z.string().regex(/^\d{2}:\d{2}$/),
  party_size: z.number().int().min(1).max(30),
  notes: z.string().max(500).optional().default(""),
});

r.post("/reservations", async (req, res) => {
  const parsed = ReservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid data", details: parsed.error.flatten() });
  }

  const d = parsed.data;

  const { rows } = await pool.query(
    `INSERT INTO reservations (name, phone, email, reservation_date, reservation_time, party_size, notes, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')
     RETURNING id`,
    [d.name, d.phone, d.email, d.reservation_date, d.reservation_time, d.party_size, d.notes]
  );

  // Emails (no bloquean la reserva si fallan)
  try {
    const mailer = makeMailer();
    const notify = process.env.RESTAURANT_NOTIFY_EMAIL;

    const subject = `Reserva ${d.reservation_date} ${d.reservation_time} (${d.party_size})`;

    if (notify) {
      await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: notify,
        subject: `Nueva ${subject}`,
        text: `Nueva reserva:
Nombre: ${d.name}
Teléfono: ${d.phone}
Email: ${d.email}
Fecha: ${d.reservation_date}
Hora: ${d.reservation_time}
Personas: ${d.party_size}
Notas: ${d.notes || "-"}
ID: ${rows[0].id}`,
      });
    }

    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: d.email,
      subject: `Confirmación recibida - ${subject}`,
      text: `¡Gracias! Hemos recibido tu reserva.

Detalles:
- Fecha: ${d.reservation_date}
- Hora: ${d.reservation_time}
- Personas: ${d.party_size}

Si necesitas modificarla, responde a este email o llama al restaurante.`,
    });
  } catch (e) {
    console.error("Email error:", e?.message || e);
  }

  return res.status(201).json({ ok: true, id: rows[0].id });
});

export default r;
