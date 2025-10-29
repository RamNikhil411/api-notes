import type { Context } from "hono";
import { signToken } from "../utils/jwt.js";
import { createUser, getUser } from "../services/auth.services.js";
import bcrypt from "bcrypt";

export const signup = async (c: Context) => {
  try {
    const body = await c.req.json();
    const user = await createUser(body);
    const token = await signToken({ id: user?.id, email: user?.email });

    return c.json(
      {
        success: true,
        data: { ...user, token },
        message: "User created successfully",
      },
      201
    );
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    if (!body.email) {
      return c.json({ success: false, message: "Email is required" }, 400);
    }
    const user = await getUser(body.email);
    if (!user) {
      return c.json({ success: false, message: "User not found" }, 400);
    }
    const passwordMatch = await bcrypt.compare(body.password, user?.password!);

    if (!passwordMatch) {
      return c.json({ success: false, message: "Invalid credentials" }, 400);
    }

    const token = await signToken({ id: user?.id, email: user?.email });

    return c.json(
      {
        success: true,
        data: { ...user, token },
        message: "User logged in successfully",
      },
      200
    );
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};
