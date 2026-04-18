import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/products?status=published — public
router.get('/', async (req, res) => {
  try {
    const status = req.query.status as string | undefined
    const filterStatus = status && status !== 'all' ? status : undefined
    const where  = filterStatus ? 'WHERE p.status = ?' : ''
    const params = filterStatus ? [filterStatus] : []

    const [products] = await pool.query(`
      SELECT
        p.id, p.name, p.slug, p.price,
        p.condition_state AS conditionState,
        p.condition_score AS conditionScore,
        p.specs, p.description, p.status,
        c.name AS categoryName,
        c.main_category AS mainCategory
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${where}
      ORDER BY p.created_at DESC
    `, params) as any[]

    const ids = (products as any[]).map((p: any) => p.id)
    let images: any[] = []
    if (ids.length) {
      const [imgRows] = await pool.query(
        `SELECT product_id, url FROM product_images WHERE product_id IN (${ids.map(() => '?').join(',')}) ORDER BY sort_order`,
        ids
      ) as any[]
      images = imgRows as any[]
    }

    const CONDITION_LABEL: Record<string, string> = {
      excellent: 'Excellent', 'tres-bon': 'Très bon', bon: 'Bon',
    }
    const MAIN_CAT: Record<string, string> = {
      telephonie: 'Téléphonie', informatique: 'Informatique', accessoires: 'Accessoires',
    }

    const result = (products as any[]).map((p: any) => {
      const gallery = images.filter(i => i.product_id === p.id).map(i => i.url)
      return {
        id:             p.id,
        name:           p.name,
        slug:           p.slug,
        price:          p.price,
        specs:          p.specs ?? '',
        description:    p.description ?? '',
        status:         p.status,
        condition:      CONDITION_LABEL[p.conditionState] ?? 'Excellent',
        conditionScore: p.conditionScore,
        category:       p.categoryName ?? '',
        mainCategory:   MAIN_CAT[p.mainCategory] ?? 'Téléphonie',
        image:          gallery[0] ?? '',
        gallery,
      }
    })

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/products/:id — admin detail
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS categoryName, c.main_category AS mainCategory
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`, [req.params.id]
    ) as any[]
    const product = (rows as any[])[0]
    if (!product) { res.status(404).json({ error: 'Not found' }); return }

    const [imgs] = await pool.query(
      'SELECT id, url, sort_order FROM product_images WHERE product_id=? ORDER BY sort_order',
      [req.params.id]
    ) as any[]

    res.json({ ...product, images: imgs })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/products — admin
router.post('/', requireAuth, async (req, res) => {
  const { name, slug, price, categoryId, condition, conditionScore, specs, description, status, images } = req.body
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [result] = await conn.query(
      `INSERT INTO products (name, slug, price, category_id, condition_state, condition_score, specs, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, price, categoryId ?? null, condition ?? 'excellent', conditionScore ?? 100, specs ?? null, description ?? null, status ?? 'published']
    ) as any[]
    const productId = result.insertId

    if (Array.isArray(images) && images.length) {
      for (let i = 0; i < images.length; i++) {
        await conn.query('INSERT INTO product_images (product_id, url, sort_order) VALUES (?,?,?)', [productId, images[i], i])
      }
    }
    await conn.commit()
    res.status(201).json({ id: productId })
  } catch (err: any) {
    await conn.rollback()
    if (err.code === 'ER_DUP_ENTRY') res.status(409).json({ error: 'Slug already exists' })
    else res.status(500).json({ error: 'Server error' })
  } finally {
    conn.release()
  }
})

// PUT /api/products/:id — admin
router.put('/:id', requireAuth, async (req, res) => {
  const { name, slug, price, categoryId, condition, conditionScore, specs, description, status, images } = req.body
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.query(
      `UPDATE products SET name=?, slug=?, price=?, category_id=?, condition_state=?, condition_score=?, specs=?, description=?, status=? WHERE id=?`,
      [name, slug, price, categoryId ?? null, condition ?? 'excellent', conditionScore ?? 100, specs ?? null, description ?? null, status ?? 'published', req.params.id]
    )
    if (Array.isArray(images)) {
      await conn.query('DELETE FROM product_images WHERE product_id=?', [req.params.id])
      for (let i = 0; i < images.length; i++) {
        await conn.query('INSERT INTO product_images (product_id, url, sort_order) VALUES (?,?,?)', [req.params.id, images[i], i])
      }
    }
    await conn.commit()
    res.json({ ok: true })
  } catch {
    await conn.rollback()
    res.status(500).json({ error: 'Server error' })
  } finally {
    conn.release()
  }
})

// DELETE /api/products/:id — admin
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=?', [req.params.id])
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
