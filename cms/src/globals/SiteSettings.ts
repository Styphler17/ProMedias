import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Réglages Globaux du Site',
  admin: {
    group: 'Réglages',
    description: 'Logos et images hero contrôlés depuis ici.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo Principal (Navbar)',
          admin: { description: 'Fond transparent ou sombre.' },
        },
        {
          name: 'logo_white',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo Blanc (Footer)',
          admin: { description: 'Version blanche pour le footer sombre.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Hero Backgrounds',
      fields: [
        {
          name: 'home_hero_bg',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero — Accueil',
          admin: { description: 'Recommandé : 1920×1080px minimum.' },
        },
        {
          name: 'services_hero_bg',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero — Services',
          admin: { description: 'Recommandé : 1920×600px.' },
        },
        {
          name: 'shop_hero_bg',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero — Boutique',
          admin: { description: 'Recommandé : 1920×600px.' },
        },
        {
          name: 'diagnostic_hero_bg',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero — Diagnostic',
          admin: { description: 'Recommandé : 1920×600px.' },
        },
      ],
    },
  ],
}
