import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const DEFAULT_JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function signToken(
  payload: object,
  expiresIn: string = DEFAULT_JWT_EXPIRES_IN
): string {
  return jwt.sign(payload as jwt.JwtPayload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): jwt.JwtPayload | string {
  return jwt.verify(token, JWT_SECRET);
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
}
