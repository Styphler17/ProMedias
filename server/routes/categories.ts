import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const MAIN_CAT: Record<string, string> = {
  telephonie: 'Téléphonie', informatique: 'Informatique', accessoires: 'Accessoires',
}

// GET /api/categories — public
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, slug, main_category, description FROM categories ORDER BY FIELD(main_category,\'telephonie\',\'informatique\',\'accessoires\'), name'
    ) as any[]
    const mapped = (rows as any[]).map(r => ({
      id:          r.id,
      name:        r.name,
      slug:        r.slug,
      description: r.description,
      mainCategory: MAIN_CAT[r.main_category] ?? r.main_category,
      mainCategorySlug: r.main_category,
    }))
    res.json(mapped)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/categories — admin
router.post('/', requireAuth, async (req, res) => {
  const { name, slug, mainCategory, description } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, main_category, description) VALUES (?, ?, ?, ?)',
      [name, slug, mainCategory, description ?? null]
    ) as any[]
    res.status(201).json({ id: result.insertId })
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') res.status(409).json({ error: 'Slug already exists' })
    else res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/categories/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  const { name, slug, mainCategory, description } = req.body
  try {
    await pool.query(
      'UPDATE categories SET name=?, slug=?, main_category=?, description=? WHERE id=?',
      [name, slug, mainCategory, description ?? null, req.params.id]
    )
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/categories/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id=?', [req.params.id])
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
