import { Hono } from "hono";
import authRoutes from "./auth.routes.js";
import notesRoutes from "./notes.routes.js";

const routes = new Hono();

routes.route("/auth", authRoutes);
routes.route("/notes", notesRoutes);
export default routes;
