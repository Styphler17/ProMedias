import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { requireAuth } from '../middleware/auth.js'
import { pool } from '../db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_DIR = path.join(__dirname, '../../uploads')

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase()
    cb(null, `${base}-${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Images only'))
  },
})

const router = Router()

// POST /api/upload — admin only, returns { url }
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) { res.status(400).json({ error: 'No file' }); return }
  const url = `/uploads/${req.file.filename}`
  const ext = path.extname(req.file.filename).toLowerCase()
  const category = (req.body.category as string) || 'uncategorized'
  try {
    await pool.query(
      `INSERT IGNORE INTO media (filename, url, original_name, size, mime_type, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.file.filename, url, req.file.originalname, req.file.size, MIME_MAP[ext] || 'image/jpeg', category]
    )
  } catch { /* non-fatal */ }
  res.json({ url })
})

export default router
