// app.ts
import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { decryptBodyMiddleware } from "./middlewares/crypto-middleware"; // ⬅️ nuevo

const app: Application = express();

// Middlewares base
app.use(cors());

// IMPORTANTE: json primero para parsear el envelope
app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`[hit] ${req.method} ${req.originalUrl} ct=${req.headers["content-type"]}`);
  next();
});

// Desencripta si el body viene como envelope o si llega header de cifrado
// Si usas AAD, el cliente debe firmar "METHOD:/api/route" (ej. "POST:/api/users/login")
app.use(decryptBodyMiddleware({ bindToMethodAndPath: true })); // ⬅️ nuevo

// Auth global (tu middleware interna ya permite públicas)
app.use(authMiddleware);

// Rutas
app.use("/api", routes);

export default app;