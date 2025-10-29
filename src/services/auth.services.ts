import { db } from "../config/db.js";
import { users } from "../db/schema/user.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, data.email));
  if ((await existing).length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })
    .returning();

  return { id: user.id, name: user.name, email: user.email };
};

export const getUser = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
  };
};
