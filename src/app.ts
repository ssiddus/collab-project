import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.route";
import projectTasks from "./routes/task.route";
import inviteUser from "./routes/orgMembers.route";
import { errorMiddleware } from "./middleware/error.middleware";
import { authRateLimit, gobalRateLimit } from "./middleware/rateLimit.middleware";
import { setupSwagger } from "./utils/swagger"

const app = express();

app.use(cors());
app.use(express.json());
app.use(gobalRateLimit)


setupSwagger(app)
app.use("/auth", authRateLimit, authRoutes);
app.use("/projects", projectRoutes)
app.use("/tasks", projectTasks)
app.use("/org", inviteUser)

app.get("/", (req, res) => {
  res.json({
    name: "Collab API",
    description: "Multi-Tenant Project Management REST API",
    status: "running",
    documentation: "https://github.com/ssiddus/collab-project#readme",
    api_docs: "/api-docs",
    health: "/health",
    test_with: "Use /api-docs (Swagger UI) to test endpoints"
  })
})

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is up and running" })
})

app.use(errorMiddleware)

export default app;
