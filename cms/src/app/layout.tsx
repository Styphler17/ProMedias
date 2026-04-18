import React from 'react'

export const metadata = {
  title: 'ProMedias CMS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
