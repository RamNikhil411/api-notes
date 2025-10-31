import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header("authorization");
  if (!authHeader) {
    return c.json(
      { success: false, message: "Authorization header is missing" },
      401
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return c.json({ success: false, message: "Token is missing" }, 401);
  }

  try {
    const user = verifyToken(token);
    if (!user) {
      return c.json({ success: false, message: "Invalid token" }, 401);
    }

    c.set("user", user);

    await next();
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 401);
  }
};
