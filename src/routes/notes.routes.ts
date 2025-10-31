import { Hono } from "hono";
import {
  createNotes,
  deleteNoteById,
  getAllNotes,
  getNoteById,
  updateNoteById,
} from "../controllers/notes.controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const notesRoutes = new Hono();

notesRoutes.use("/*", authMiddleware);

notesRoutes.post("/", createNotes);
notesRoutes.get("/", getAllNotes);

notesRoutes.get("/:id", getNoteById);
notesRoutes.put("/:id", updateNoteById);

notesRoutes.delete("/:id", deleteNoteById);

export default notesRoutes;
