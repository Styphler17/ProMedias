import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Catégorie', plural: 'Catégories' },
  admin: {
    group: 'Boutique',
    useAsTitle: 'name',
    defaultColumns: ['name', 'mainCategory', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: { description: 'Ex: iphone, macbook, accessoires-apple' },
    },
    {
      name: 'mainCategory',
      type: 'select',
      label: 'Catégorie principale',
      required: true,
      options: [
        { label: 'Téléphonie', value: 'telephonie' },
        { label: 'Informatique', value: 'informatique' },
        { label: 'Accessoires', value: 'accessoires' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description (affichée dans la boutique)',
    },
  ],
}
