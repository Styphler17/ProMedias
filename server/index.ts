import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import authRoutes      from './routes/auth.js'
import productsRoutes  from './routes/products.js'
import categoriesRoutes from './routes/categories.js'
import settingsRoutes  from './routes/settings.js'
import uploadRoutes    from './routes/upload.js'
import mediaRoutes          from './routes/media.js'
import announcementsRoutes  from './routes/announcements.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app  = express()
const PORT = process.env.PORT || 3002

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// API routes
app.use('/api/auth',       authRoutes)
app.use('/api/products',   productsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/settings',   settingsRoutes)
app.use('/api/upload',     uploadRoutes)
app.use('/api/media',          mediaRoutes)
app.use('/api/announcements',  announcementsRoutes)

const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(path.join(distPath, 'index.html'))) {
  app.use(express.static(distPath))
  app.use((_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  // Fallback for development if someone visits port 3002 directly
  app.get('/', (_req, res) => {
    res.send('ProMedias API Server is running. Access the frontend via the Vite Dev Server (usually http://localhost:5173).')
  })
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
