import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { signToken, requireAuth } from '../middleware/auth.js'
import type { AuthRequest } from '../middleware/auth.js'
import type { RowDataPacket } from 'mysql2'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) { res.status(400).json({ error: 'Email and password required' }); return }
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, password_hash FROM admin_users WHERE email = ?', [email]
    )
    const user = rows[0]
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid credentials' }); return
    }
    res.json({ token: signToken(user.id) })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// POST /api/auth/register — only when no admin exists
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) { res.status(400).json({ error: 'Email and password required' }); return }
  try {
    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM admin_users LIMIT 1')
    if (existing.length > 0) { res.status(403).json({ error: 'Admin already exists' }); return }
    const hash = await bcrypt.hash(password, 12)
    await pool.query('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)', [email, hash])
    res.status(201).json({ ok: true })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// GET /api/auth/ping — version check
router.get('/ping', (_req, res) => { res.json({ v: 2 }) })

// GET /api/auth/me — returns current user profile
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, avatar, created_at FROM admin_users WHERE id = ?', [req.adminId]
    )
    const user = rows[0]
    if (!user) { res.status(401).json({ error: 'User not found' }); return }
    res.json(user)
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// PUT /api/auth/profile — update email, password, avatar
router.put('/profile', requireAuth, async (req: AuthRequest, res) => {
  const { email, currentPassword, newPassword, avatar } = req.body
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, password_hash FROM admin_users WHERE id = ?', [req.adminId]
    )
    const user = rows[0]
    if (!user) { res.status(401).json({ error: 'User not found' }); return }

    const updates: string[] = []
    const params: unknown[] = []

    if (email && email !== user.email) {
      const [dup] = await pool.query<RowDataPacket[]>('SELECT id FROM admin_users WHERE email = ? AND id != ?', [email, req.adminId])
      if (dup.length > 0) { res.status(409).json({ error: 'Email already in use' }); return }
      updates.push('email = ?'); params.push(email)
    }

    if (newPassword) {
      if (!currentPassword) { res.status(400).json({ error: 'Current password required' }); return }
      if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
        res.status(401).json({ error: 'Current password is incorrect' }); return
      }
      if (newPassword.length < 8) { res.status(400).json({ error: 'New password must be at least 8 characters' }); return }
      updates.push('password_hash = ?'); params.push(await bcrypt.hash(newPassword, 12))
    }

    if (avatar !== undefined) {
      updates.push('avatar = ?'); params.push(avatar || null)
    }

    if (updates.length) {
      params.push(req.adminId)
      await pool.query(`UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`, params)
    }

    const [updated] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, avatar, created_at FROM admin_users WHERE id = ?', [req.adminId]
    )
    res.json(updated[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
