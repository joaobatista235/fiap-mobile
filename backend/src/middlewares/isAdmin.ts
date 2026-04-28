import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export function isAdmin(req: Request, res: Response, next: NextFunction) {

  const auth = req.headers.authorization

  if (!auth) {
    return res.status(401).json({ error: "Token missing" })
  }

  const token = auth.split(" ")[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

  if (decoded.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin only" })
  }

  next()
}