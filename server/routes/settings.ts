import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const SITE_KEYS    = ['logo','logo_white','home_hero_bg','services_hero_bg','shop_hero_bg','diagnostic_hero_bg','about_hero_bg']
const ABOUT_KEYS   = ['hero_image','environmental_impact_image','boutique_storefront_image','team_1','team_2','team_3','team_4']
const CONTACT_KEYS = ['contact_shop_name','contact_address','contact_phone','contact_email','contact_hours_weekdays','contact_hours_saturday','contact_hours_sunday','contact_facebook','contact_instagram','contact_whatsapp','contact_maps_url','contact_storefront_url']

async function getKeys(keys: string[]) {
  const [rows] = await pool.query(
    `SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN (${keys.map(() => '?').join(',')})`,
    keys
  ) as any[]
  return Object.fromEntries((rows as any[]).map((r: any) => [r.setting_key, r.setting_value]))
}

// GET /api/settings/site — public
router.get('/site', async (_req, res) => {
  try { res.json(await getKeys(SITE_KEYS)) }
  catch { res.status(500).json({ error: 'Server error' }) }
})

// GET /api/settings/about — public
router.get('/about', async (_req, res) => {
  try { res.json(await getKeys(ABOUT_KEYS)) }
  catch { res.status(500).json({ error: 'Server error' }) }
})

// GET /api/settings/contact — public
router.get('/contact', async (_req, res) => {
  try { res.json(await getKeys(CONTACT_KEYS)) }
  catch { res.status(500).json({ error: 'Server error' }) }
})

// GET /api/settings — admin: all settings
router.get('/', requireAuth, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings') as any[]
    res.json(Object.fromEntries((rows as any[]).map((r: any) => [r.setting_key, r.setting_value])))
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// PUT /api/settings — admin: update multiple keys
router.put('/', requireAuth, async (req, res) => {
  const updates = req.body as Record<string, string | null>
  try {
    for (const [key, value] of Object.entries(updates)) {
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=?',
        [key, value, value]
      )
    }
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

export default router
