import { pool } from "../db.js";
import { ReservaCreateSchema, ReservaUpdateSchema, StatusSchema } from "../schemas/reservas.schema.js";

export async function crearReserva(req, res) {
  const parse = ReservaCreateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ ok:false, error: parse.error.flatten() });
  const data = parse.data;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Upsert cliente por email
    const [r1] = await conn.execute(
      `INSERT INTO clientes (email, nombre, apellido, telefono, acepta_novedades)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         nombre = VALUES(nombre),
         apellido = VALUES(apellido),
         telefono = VALUES(telefono),
         acepta_novedades = VALUES(acepta_novedades),
         id = LAST_INSERT_ID(id)`,
      [data.email, data.nombre, data.apellido, data.telefono, data.acepta_novedades]
    );
    const clienteId = r1.insertId;

    // Crear reserva con snapshot opcional
    await conn.execute(
  `INSERT INTO reservas (cliente_id, reservation_datetime, cantidad_personas, status)
   VALUES (?, ?, ?, 'pendiente')`,
  [clienteId, data.reservation_datetime, data.cantidad_personas]
);

    await conn.commit();
    res.status(201).json({ ok: true });
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ ok:false, error:"Reserva duplicada para ese cliente y horario." });
    console.error(err);
    res.status(500).json({ ok:false, error:"Error al crear reserva" });
  } finally {
    conn.release();
  }
}

export async function listarReservas(req, res) {
  const { status } = req.query;
  const params = [];
  let where = "";
  if (status) { where = "WHERE r.status = ?"; params.push(status); }
  const [rows] = await pool.execute(
    `SELECT r.id, r.reservation_datetime, r.cantidad_personas, r.status,
            c.id AS cliente_id, c.nombre, c.apellido, c.email, c.telefono
     FROM reservas r
     JOIN clientes c ON c.id = r.cliente_id
     ${where}
     ORDER BY r.reservation_datetime ASC`,
    params
  );
  res.json({ ok: true, data: rows });
}

export async function actualizarReserva(req, res) {
  const id = Number(req.params.id);
  const parse = ReservaUpdateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ ok:false, error: parse.error.flatten() });
  const fields = parse.data;

  const sets = [];
  const vals = [];
  if (fields.reservation_datetime) { sets.push("reservation_datetime = ?"); vals.push(fields.reservation_datetime); }
  if (fields.cantidad_personas)   { sets.push("cantidad_personas = ?");     vals.push(fields.cantidad_personas); }


  if (!sets.length) return res.status(400).json({ ok:false, error:"Nada para actualizar" });

  vals.push(id);
  try {
    await pool.execute(`UPDATE reservas SET ${sets.join(", ")} WHERE id = ?`, vals);
    res.json({ ok:true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ ok:false, error:"Choque con reserva existente" });
    res.status(500).json({ ok:false, error:"Error al actualizar" });
  }
}

export async function cambiarStatus(req, res) {
  const id = Number(req.params.id);
  const parse = StatusSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ ok:false, error: parse.error.flatten() });

  await pool.execute(`UPDATE reservas SET status = ? WHERE id = ?`, [parse.data.status, id]);
  res.json({ ok:true });
}

export async function eliminarReserva(req, res) {
  const id = Number(req.params.id);
  await pool.execute(`DELETE FROM reservas WHERE id = ?`, [id]);
  res.json({ ok:true });
}