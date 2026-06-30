import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

import db from "../db/database.js";
import type { User } from "../routes/users.js";

const register = async (email: string, password: string): Promise<User> => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  const insert = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
  const result = insert.run(email, hashedPassword);
  const user: User = {
    id: result.lastInsertRowid as number,
    email
  };

  return user;
}

const login = async (email: string, password: string): Promise<string | null> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  const user: User | undefined = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password || '');
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' });
  return token;
}

export { register, login };