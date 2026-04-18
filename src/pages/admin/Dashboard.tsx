import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Tag, Settings, ArrowRight } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminGetProducts, adminGetCategories } from '@/lib/admin'

export default function Dashboard() {
  const [counts, setCounts] = useState({ products: 0, categories: 0 })

  useEffect(() => {
    Promise.all([adminGetProducts(), adminGetCategories()])
      .then(([p, c]) => setCounts({ products: p.length, categories: c.length }))
      .catch(() => {})
  }, [])

  const cards = [
    { to: '/admin/products',   icon: Package, label: 'Produits',   count: counts.products,   color: 'bg-blue-50 text-blue-600' },
    { to: '/admin/categories', icon: Tag,     label: 'Catégories', count: counts.categories, color: 'bg-purple-50 text-purple-600' },
    { to: '/admin/settings',   icon: Settings, label: 'Réglages',  count: null,              color: 'bg-zinc-50 text-zinc-600' },
  ]

  return (
    <AdminLayout>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-1">Tableau de bord</h1>
        <p className="text-zinc-500 text-sm mb-8">Bienvenue dans l'interface d'administration ProMedias.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map(({ to, icon: Icon, label, count, color }) => (
            <Link key={to} to={to} className="bg-white rounded-2xl border border-zinc-100 p-6 hover:shadow-md transition-shadow group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
              {count !== null && <p className="text-3xl font-bold">{count}</p>}
              <div className="flex items-center gap-1 mt-4 text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
                Gérer <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
