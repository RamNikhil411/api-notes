import { jwt, sign, verify } from "hono/jwt";

export const signToken = (payload: any) => {
  return sign(payload, process.env.JWT_SECRET!);
};

export const verifyToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET!);
};
