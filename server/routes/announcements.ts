import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/announcements — public, active only
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, subtitle, image_url, whatsapp_message FROM announcements WHERE active=1 ORDER BY sort_order, id'
    ) as any[]
    res.json(rows)
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// GET /api/announcements/all — admin, all
router.get('/all', requireAuth, async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM announcements ORDER BY sort_order, id'
    ) as any[]
    res.json(rows)
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// POST /api/announcements — admin
router.post('/', requireAuth, async (req, res) => {
  const { title, subtitle, image_url, whatsapp_message, sort_order, active } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO announcements (title, subtitle, image_url, whatsapp_message, sort_order, active) VALUES (?,?,?,?,?,?)',
      [title, subtitle ?? null, image_url, whatsapp_message ?? null, sort_order ?? 0, active ?? 1]
    ) as any[]
    res.status(201).json({ id: result.insertId })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// PUT /api/announcements/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  const { title, subtitle, image_url, whatsapp_message, sort_order, active } = req.body
  try {
    await pool.query(
      'UPDATE announcements SET title=?, subtitle=?, image_url=?, whatsapp_message=?, sort_order=?, active=? WHERE id=?',
      [title, subtitle ?? null, image_url, whatsapp_message ?? null, sort_order ?? 0, active ?? 1, req.params.id]
    )
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// PATCH /api/announcements/:id/toggle — admin
router.patch('/:id/toggle', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE announcements SET active = NOT active WHERE id=?', [req.params.id])
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// DELETE /api/announcements/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM announcements WHERE id=?', [req.params.id])
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

export default router
