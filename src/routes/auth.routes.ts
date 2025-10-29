import { Hono } from "hono";
import { login, signup } from "../controllers/auth.controller.js";

const authRoutes = new Hono();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);

export default authRoutes;
