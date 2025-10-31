import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware.js";
import {
  createNotes,
  deleteNoteById,
  getAllNotes,
  getNoteById,
  updateNoteById,
} from "../controllers/notes.controller.js";
import { notes } from "../db/schema/notes.js";

const notesRoutes = new Hono();

notesRoutes.use("/*", authMiddleware);

notesRoutes.post("/", createNotes);
notesRoutes.get("/", getAllNotes);

notesRoutes.get("/:id", getNoteById);
notesRoutes.put("/:id", updateNoteById);

notesRoutes.delete("/:id", deleteNoteById);

export default notesRoutes;
