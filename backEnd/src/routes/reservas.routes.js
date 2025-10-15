import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { crearReserva, listarReservas, actualizarReserva, cambiarStatus, eliminarReserva } from "../controllers/reservas.controller.js";

const router = Router();

// público: crear reserva
router.post("/", crearReserva);

// admin: ver, editar, cambiar estado, eliminar
router.get("/", requireAuth, requireAdmin, listarReservas);
router.put("/:id", requireAuth, requireAdmin, actualizarReserva);
router.patch("/:id/status", requireAuth, requireAdmin, cambiarStatus);
router.delete("/:id", requireAuth, requireAdmin, eliminarReserva);

export default router;