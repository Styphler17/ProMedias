import { Router } from 'express'
import { pool } from '../db.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_DIR = path.join(__dirname, '../../uploads')

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
}

async function syncFilesystem() {
  if (!fs.existsSync(UPLOAD_DIR)) return
  const files = fs.readdirSync(UPLOAD_DIR).filter(f => !f.startsWith('.'))
  for (const filename of files) {
    const filepath = path.join(UPLOAD_DIR, filename)
    const stat = fs.statSync(filepath)
    if (!stat.isFile()) continue
    const ext = path.extname(filename).toLowerCase()
    const mime = MIME_MAP[ext] || 'image/jpeg'
    await pool.query(
      `INSERT IGNORE INTO media (filename, url, original_name, size, mime_type, category)
       VALUES (?, ?, ?, ?, ?, 'uncategorized')`,
      [filename, `/uploads/${filename}`, filename, stat.size, mime]
    )
  }
}

const router = Router()

// GET /api/media
router.get('/', requireAuth, async (req, res) => {
  try {
    await syncFilesystem()
    const { category, search, sort } = req.query
    const conditions: string[] = []
    const params: any[] = []

    if (category && category !== 'all') {
      conditions.push('category = ?')
      params.push(category)
    }
    if (search) {
      conditions.push('original_name LIKE ?')
      params.push(`%${search}%`)
    }

    let q = 'SELECT * FROM media'
    if (conditions.length) q += ' WHERE ' + conditions.join(' AND ')

    if (sort === 'name') q += ' ORDER BY original_name ASC'
    else if (sort === 'size') q += ' ORDER BY size DESC'
    else q += ' ORDER BY created_at DESC'

    const [rows] = await pool.query(q, params) as any[]
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to list media' })
  }
})

// PATCH /api/media/:id — update category
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { category } = req.body
    await pool.query('UPDATE media SET category = ? WHERE id = ?', [category, req.params.id])
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Update failed' })
  }
})

// DELETE /api/media/:id — remove file + DB record
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT filename FROM media WHERE id = ?', [req.params.id]) as any[]
    const row = (rows as any[])[0]
    if (!row) { res.status(404).json({ error: 'Not found' }); return }
    const filepath = path.join(UPLOAD_DIR, row.filename)
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
    await pool.query('DELETE FROM media WHERE id = ?', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Delete failed' })
  }
})

export default router
