import type { Context } from "hono";
import { db } from "../config/db.js";
import { notes } from "../db/schema/notes.js";
import { and, eq, sql } from "drizzle-orm";

export const createNotes = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log(c);
    const user = await c.get("user");

    if (!user) {
      return c.json({ success: false, message: "User not found" }, 401);
    }

    if (!body.title) {
      return c.json(
        {
          success: false,
          message: "Title is required",
          err_data: { title: "Title is required" },
        },
        400
      );
    }

    if (!body.content) {
      return c.json(
        {
          success: false,
          message: "Content is required",
          err_data: { content: "Content is required" },
        },
        400
      );
    }

    const note = await db
      .insert(notes)
      .values({ title: body.title, content: body.content, userID: user.id })
      .returning();

    return c.json({ success: true, data: note, message: "Note created" }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

export const getAllNotes = async (c: Context) => {
  const page = c.req.query("page") || 1;
  const limit = c.req.query("limit") || 10;
  const user = await c.get("user");
  !user && c.json({ success: false, message: "User not found" }, 401);

  const [records, totalResult] = await Promise.all([
    db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .where(eq(notes.userID, user.id))
      .limit(+limit)
      .offset((+page - 1) * +limit),

    db
      .select({ count: sql<number>`count(*)` })
      .from(notes)
      .where(eq(notes.userID, user.id)),
  ]);

  const total = Number(totalResult[0].count);

  return c.json(
    {
      success: true,
      pagination_info: {
        page: Number(page),
        limit: Number(limit),
        total: total,
      },
      data: records,
      message: "Notes fetched",
    },
    200
  );
};

export const getNoteById = async (c: Context) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ success: false, message: "Id is required" }, 400);
  }

  const user = await c.get("user");

  if (!user) {
    return c.json({ success: false, message: "User not found" }, 401);
  }

  const note = await db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .where(and(eq(notes.id, +id), eq(notes.userID, user.id)));

  return c.json({ success: true, data: note, message: "Note fetched" }, 200);
};

export const updateNoteById = async (c: Context) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ success: false, message: "Id is required" }, 400);
  }
  const user = await c.get("user");

  if (!user) {
    return c.json({ success: false, message: "User not found" }, 401);
  }

  const body = await c.req.json();

  if (!body.title) {
    return c.json(
      {
        success: false,
        message: "Title is required",
        err_data: { title: "Title is required" },
      },
      400
    );
  }

  if (!body.content) {
    return c.json(
      {
        success: false,
        message: "Content is required",
        err_data: { content: "Content is required" },
      },
      400
    );
  }

  const note = await db
    .update(notes)
    .set({ title: body.title, content: body.content })
    .where(and(eq(notes.id, +id), eq(notes.userID, user.id)))
    .returning();

  return c.json(
    { success: true, data: note, message: "Note updated successfully" },
    200
  );
};

export const deleteNoteById = async (c: Context) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ success: false, message: "Id is required" }, 400);
  }

  const user = await c.get("user");

  if (!user) {
    return c.json({ success: false, message: "User not found" }, 401);
  }

  const note = await db
    .delete(notes)
    .where(and(eq(notes.id, +id), eq(notes.userID, user.id)))
    .returning();

  return c.json({ success: true, data: note, message: "Note deleted" }, 200);
};
