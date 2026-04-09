import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.route";
import projectTasks from "./routes/task.route";
import inviteUser from "./routes/orgMembers.route";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes)
app.use("/tasks", projectTasks)
app.use("/org", inviteUser)

app.get("/health", (req, res) => {
  res.json({ message: "Server Running Baby!!!" });
})

app.use(errorMiddleware)

export default app;
