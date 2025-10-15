import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const EMPLEADO = {
  id: 1,
  email: "admin@resto.com",
  // hash de "pass"
  password_hash: "$2a$10$JVV8QSDJIFUyj39ZhEEkJO7Za0pKWDIRrBy0lo8eVes8.7addpzNm",
  role: "admin",
};

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (email !== EMPLEADO.email) return res.status(401).json({ ok: false, error: "Credenciales" });
  const ok = await bcrypt.compare(password || "", EMPLEADO.password_hash);
  if (!ok) return res.status(401).json({ ok: false, error: "Credenciales" });
  const token = jwt.sign({ id: EMPLEADO.id, email, role: EMPLEADO.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ ok: true, token });
}