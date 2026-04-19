import { useEffect, useState } from 'react'
import { Trash2, RotateCcw, Package, Image as ImageIcon, Search, AlertCircle, Loader2 } from 'lucide-react'
import { adminGetProducts, adminRestoreProduct, adminPurgeProduct, adminGetMedia, adminRestoreMedia, adminPurgeMedia } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import { cn } from '@/lib/utils'
import AdminLayout from '@/components/admin/AdminLayout'

export default function Trash() {
  const [activeTab, setActiveTab] = useState<'products' | 'media'>('products')
  const [loading, setLoading]     = useState(true)
  const [products, setProducts]   = useState<any[]>([])
  const [media, setMedia]         = useState<any[]>([])
  const [search, setSearch]       = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [p, m] = await Promise.all([
        adminGetProducts('trash'),
        adminGetMedia({ status: 'trash' })
      ])
      setProducts(p)
      setMedia(m)
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreProduct = async (id: number) => {
    if (!confirm('Restaurer ce produit ?')) return
    await adminRestoreProduct(id)
    load()
  }

  const handlePurgeProduct = async (id: number) => {
    if (!confirm('Supprimer DEFINITIVEMENT ? Cette action est irréversible.')) return
    await adminPurgeProduct(id)
    load()
  }

  const handleRestoreMedia = async (id: number) => {
    if (!confirm('Restaurer ce média ?')) return
    await adminRestoreMedia(id)
    load()
  }

  const handlePurgeMedia = async (id: number) => {
    if (!confirm('Supprimer DEFINITIVEMENT ? Cette action est irréversible.')) return
    await adminPurgeMedia(id)
    load()
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const filteredMedia    = media.filter(m => m.filename.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Corbeille</h1>
            <p className="text-zinc-500">Gérez les éléments supprimés (auto-purges après 30 jours)</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher dans la corbeille..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(357,83%,37%)]/10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-zinc-100 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('products')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'products' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Package size={16} />
            Produits ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('media')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'media' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <ImageIcon size={16} />
            Médias ({media.length})
          </button>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden min-h-[400px] flex flex-col shadow-sm">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="animate-spin text-[hsl(357,83%,37%)]" size={32} />
              <p className="text-zinc-400 text-sm">Chargement de la corbeille...</p>
            </div>
          ) : (activeTab === 'products' ? filteredProducts : filteredMedia).length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                <Trash2 size={32} />
              </div>
              <div>
                <p className="text-zinc-900 font-medium">Corbeille vide</p>
                <p className="text-zinc-500 text-sm max-w-xs">Aucun {activeTab === 'products' ? 'produit' : 'média'} ne se trouve dans la corbeille actuellement.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-inter">
                <thead className="bg-zinc-50 divide-y divide-zinc-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Élément</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Supprimé le</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {activeTab === 'products' ? (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-100 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                            {p.image ? (
                              <img src={resolveUrl(p.image)} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <Package className="w-full h-full p-2.5 text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-900">{p.name}</p>
                            <p className="text-xs text-zinc-500">{p.category_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">
                          {new Date(p.deleted_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleRestoreProduct(p.id)}
                            className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Restaurer"
                          >
                            <RotateCcw size={18} />
                          </button>
                          <button 
                            onClick={() => handlePurgeProduct(p.id)}
                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Supprimer définitivement"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredMedia.map(m => (
                      <tr key={m.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-100 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                            <img src={resolveUrl(m.url)} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">{m.filename}</p>
                            <p className="text-xs text-zinc-500">{m.type} • {(m.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">
                          {new Date(m.deleted_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleRestoreMedia(m.id)}
                            className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Restaurer"
                          >
                            <RotateCcw size={18} />
                          </button>
                          <button 
                            onClick={() => handlePurgeMedia(m.id)}
                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Supprimer définitivement"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm leading-relaxed font-medium">
            <strong>Note de sécurité :</strong> Les éléments présents dans la corbeille sont automatiquement supprimés après 30 jours. Vous pouvez les restaurer à tout moment avant cette échéance.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
