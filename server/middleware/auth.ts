import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-jwt-secret'

export interface AuthRequest extends Request {
  adminId?: number
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  try {
    const payload = jwt.verify(header.slice(7), SECRET) as { id: number }
    req.adminId = payload.id
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export function signToken(id: number) {
  return jwt.sign({ id }, SECRET, { expiresIn: '7d' })
}
