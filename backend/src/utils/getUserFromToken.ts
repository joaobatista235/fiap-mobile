import { Request } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export function getUserFromToken(req: Request): string {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error("Token não enviado");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as JwtPayload;

  return decoded.id;
}