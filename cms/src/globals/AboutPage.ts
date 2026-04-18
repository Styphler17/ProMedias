import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Page À Propos',
  admin: {
    group: 'Réglages',
    description: 'Images de la page À Propos.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image Hero (Technicien)',
      admin: { description: 'Photo affichée dans le hero de la page À Propos.' },
    },
    {
      name: 'environmental_impact_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image Impact Écologique',
    },
    {
      name: 'boutique_storefront_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de la Boutique (Vitrine)',
      admin: { description: 'Format 16:9 recommandé.' },
    },
    {
      type: 'collapsible',
      label: 'Photos Équipe (format portrait 3:4)',
      fields: [
        {
          name: 'team_1',
          type: 'upload',
          relationTo: 'media',
          label: 'Expert 1 — iPhone',
        },
        {
          name: 'team_2',
          type: 'upload',
          relationTo: 'media',
          label: 'Expert 2 — Mac',
        },
        {
          name: 'team_3',
          type: 'upload',
          relationTo: 'media',
          label: 'Expert 3 — Micro-Soudure',
        },
        {
          name: 'team_4',
          type: 'upload',
          relationTo: 'media',
          label: 'Expert 4 — Diagnostic',
        },
      ],
    },
  ],
}
