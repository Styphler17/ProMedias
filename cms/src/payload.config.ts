import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nextPayload } from '@payloadcms/next'
import path from 'path'
import { fileURLToPath } from 'url'

import { Media }      from './collections/Media'
import { Products }   from './collections/Products'
import { Categories } from './collections/Categories'
import { SiteSettings } from './globals/SiteSettings'
import { AboutPage }    from './globals/AboutPage'

const filename = fileURLToPath(import.meta.url)
const dirname  = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— ProMedias CMS',
      favicon: '/favicon.ico',
    },
  },

  editor: lexicalEditor({}),

  collections: [
    Media,
    Categories,
    Products,
    // Built-in users collection
    {
      slug: 'users',
      labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
      admin: { group: 'Réglages', useAsTitle: 'email' },
      auth: true,
      fields: [],
    },
  ],

  globals: [
    SiteSettings,
    AboutPage,
  ],

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./promedias.db',
    },
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // CORS — allow the React frontend to call this API
  cors: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
  ],

  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
  ],

  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },

  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',

  plugins: [],
})
