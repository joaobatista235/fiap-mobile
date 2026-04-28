import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Post Service API",
      version: "1.0.0",
      description: "API para gerenciamento de posts",
    },
  },
  apis: ["./src/routes/*.ts"], // onde estão suas rotas
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}
