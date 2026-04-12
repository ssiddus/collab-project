import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

import { Express } from "express"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Collab API",
      version: "1.0.0",
      description: "Multi-Tenant Project Management REST API with JWT Authentication and RBAC"
    },
    servers: [
      { url: "https://collab-api-k1or.onrender.com", description: "Production" },
      { url: "http://localhost:9322", description: "Local" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.ts"]
}

const specs = swaggerJsdoc(options)

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none}",
    customSiteTitle: "Collab API Docs"
  }))
}
