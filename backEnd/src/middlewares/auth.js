import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: "Token faltante" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    return next();
  } catch {
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin")
    return res.status(403).json({ ok: false, error: "Solo admin" });
  next();
}