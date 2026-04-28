import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "@/routes";
import { setupSwagger } from "@/swagger";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],  })
);

app.use(express.json());

app.use("/api", routes);

// Swagger
setupSwagger(app);

export default app;