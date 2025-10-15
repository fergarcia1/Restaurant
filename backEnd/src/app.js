import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import reservasRoutes from "./routes/reservas.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_,res)=>res.json({ok:true}));

app.use("/api/auth", authRoutes);
app.use("/api/reservas", reservasRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));