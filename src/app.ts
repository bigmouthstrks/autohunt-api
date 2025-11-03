import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import { authMiddleware } from "./middlewares/auth.middleware";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
// Middleware global de auth (con excepciones internas para rutas públicas)
app.use(authMiddleware);
app.use("/api", routes);

export default app;
