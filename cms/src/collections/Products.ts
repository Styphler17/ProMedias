import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produit', plural: 'Produits' },
  admin: {
    group: 'Boutique',
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'condition', 'category', 'updatedAt'],
    description: 'Vitrine des appareils reconditionnés — aucun panier ni paiement.',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ── Identity ────────────────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      label: 'Nom du produit',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: { description: 'Ex: iphone-13-pro-256gb' },
    },
    // ── Pricing (display only) ───────────────────────────────────────────────
    {
      name: 'price',
      type: 'text',
      label: 'Prix affiché',
      required: true,
      admin: { description: 'Ex: 599 €' },
    },
    // ── Category ────────────────────────────────────────────────────────────
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Catégorie',
      required: true,
    },
    // ── Condition ───────────────────────────────────────────────────────────
    {
      name: 'condition',
      type: 'select',
      label: 'État',
      required: true,
      defaultValue: 'excellent',
      options: [
        { label: 'Excellent', value: 'excellent' },
        { label: 'Très bon', value: 'tres-bon' },
        { label: 'Bon', value: 'bon' },
      ],
    },
    {
      name: 'conditionScore',
      type: 'number',
      label: 'Score état (0-100)',
      defaultValue: 100,
      min: 0,
      max: 100,
    },
    // ── Description ─────────────────────────────────────────────────────────
    {
      name: 'specs',
      type: 'textarea',
      label: 'Spécifications courtes',
      admin: { description: 'Ex: 256GB · Face ID · 5G · Batterie 89%' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description longue',
    },
    // ── Images ──────────────────────────────────────────────────────────────
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      minRows: 1,
      maxRows: 5,
      admin: { description: 'Première image = image principale.' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
    },
    // ── Visibility ──────────────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Publié', value: 'published' },
        { label: 'Brouillon', value: 'draft' },
        { label: 'Vendu', value: 'sold' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
