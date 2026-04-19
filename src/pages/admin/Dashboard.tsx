import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Tag, Settings, ArrowRight, History, PlusCircle, Trash, RefreshCcw, FileText } from 'lucide-react'
import { adminGetProducts, adminGetCategories, adminGetDashboard, type AdminActivity } from '@/lib/admin'

export default function Dashboard() {
  const [counts, setCounts]     = useState({ products: 0, categories: 0 })
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      adminGetProducts(), 
      adminGetCategories(),
      adminGetDashboard()
    ])
      .then(([p, c, d]) => {
        setCounts({ products: p.length, categories: c.length })
        setActivities(d.activities || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { to: '/admin/products',   icon: Package, label: 'Produits',   count: counts.products,   color: 'bg-blue-50 text-blue-600' },
    { to: '/admin/categories', icon: Tag,     label: 'Catégories', count: counts.categories, color: 'bg-purple-50 text-purple-600' },
    { to: '/admin/settings',   icon: Settings, label: 'Réglages',  count: null,              color: 'bg-zinc-50 text-zinc-600' },
  ]

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create':  return <PlusCircle size={14} className="text-emerald-500" />
      case 'delete':  return <Trash size={14} className="text-rose-500" />
      case 'restore': return <RefreshCcw size={14} className="text-blue-500" />
      case 'purge':   return <Trash size={14} className="text-zinc-600" />
      default:        return <FileText size={14} className="text-zinc-400" />
    }
  }

  const formatDistance = (dateStr: string) => {
    const date = new Date(dateStr)
    const now  = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return "À l'instant"
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      <header>
        <h1 className="text-2xl font-bold mb-1 text-zinc-900">Tableau de bord</h1>
        <p className="text-zinc-500 text-sm">Bienvenue dans l'interface d'administration ProMedias.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ to, icon: Icon, label, count, color }) => (
          <Link key={to} to={to} className="bg-white rounded-2xl border border-zinc-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${color}`}>
              <Icon size={24} />
            </div>
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
            {count !== null ? (
              <p className="text-3xl font-extrabold text-zinc-900">{count}</p>
            ) : (
              <p className="text-lg font-semibold text-zinc-400">Configurer</p>
            )}
            <div className="flex items-center gap-1 mt-4 text-xs font-bold text-[hsl(357,83%,37%)] opacity-0 group-hover:opacity-100 transition-all">
              GÉRER <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="text-zinc-400" size={20} />
            <h2 className="text-lg font-bold text-zinc-900">Activité récente</h2>
          </div>
          <Link to="/admin/trash" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">
            Voir la corbeille
          </Link>
        </div>

        <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 flex items-center justify-center text-zinc-400 text-sm animate-pulse">
              Chargement de l'activité...
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-400 text-sm italic">Aucune activité récente à afficher.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {activities.map((act) => (
                <div key={act.id} className="p-4 flex items-center gap-4 hover:bg-zinc-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                    {getActionIcon(act.action_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-900">
                      <span className="font-semibold text-[hsl(357,83%,37%)]">
                        {act.display_name || act.user_email.split('@')[0]}
                      </span>
                      {" "}
                      {act.action_type === 'create' ? 'a créé' : 
                       act.action_type === 'delete' ? 'a supprimé' :
                       act.action_type === 'restore' ? 'a restauré' :
                       'a mis à jour'}
                      {" "}
                      <span className="font-medium">{act.entity_type === 'product' ? 'le produit' : 'le média'}</span>
                      {" "}
                      <span className="text-zinc-500 italic">#{act.entity_id}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {act.details} • {formatDistance(act.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
