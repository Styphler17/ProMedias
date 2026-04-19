import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, Settings, LogOut, Image, Phone, User, ExternalLink, Search, X, Megaphone, Menu } from 'lucide-react'
import { clearToken, adminGetProfile, adminGetProducts, adminGetCategories } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import { cn } from '@/lib/utils'
import logo from '@/assets/logo.png'

type Hit = { type: 'page' | 'product' | 'category'; label: string; sub?: string; to: string; icon: React.ElementType }

const NAV_PAGES: Hit[] = [
  { type: 'page', label: 'Dashboard',    to: '/admin',            icon: LayoutDashboard },
  { type: 'page', label: 'Produits',     to: '/admin/products',   icon: Package        },
  { type: 'page', label: 'Catégories',   to: '/admin/categories', icon: Tag            },
  { type: 'page', label: 'Médiathèque',  to: '/admin/media',      icon: Image          },
  { type: 'page', label: 'Réglages',     to: '/admin/settings',   icon: Settings       },
  { type: 'page', label: 'Contact',      to: '/admin/contact',    icon: Phone          },
  { type: 'page', label: 'Mon profil',   to: '/admin/profile',        icon: User      },
  { type: 'page', label: 'Annonces',    to: '/admin/announcements',  icon: Megaphone },
]

interface SearchProduct {
  id: number
  name: string
  slug: string
  image?: string
}

interface SearchCategory {
  id: number
  name: string
  slug: string
}

function GlobalSearch() {
  const navigate = useNavigate()
  const [query, setQuery]           = useState('')
  const [hits, setHits]             = useState<Hit[]>([])
  const [open, setOpen]             = useState(false)
  const [products, setProducts]     = useState<SearchProduct[] | null>(null)
  const [categories, setCategories] = useState<SearchCategory[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef   = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Lazy-load data on first keystroke
  const ensureData = async () => {
    if (products !== null) return
    const [p, c] = await Promise.all([adminGetProducts(), adminGetCategories()])
    setProducts(p)
    setCategories(c)
  }

  const handleChange = async (q: string) => {
    setQuery(q)
    if (!q.trim()) { setHits([]); setOpen(false); return }
    await ensureData()
    const lq = q.toLowerCase()

    const pageHits: Hit[] = NAV_PAGES.filter(p => p.label.toLowerCase().includes(lq))

    const productHits: Hit[] = (products ?? [])
      .filter((p: SearchProduct) => p.name.toLowerCase().includes(lq))
      .slice(0, 5)
      .map((p: SearchProduct) => ({ type: 'product', label: p.name, sub: 'Produit', to: '/admin/products', icon: Package }))

    const categoryHits: Hit[] = (categories ?? [])
      .filter((c: SearchCategory) => c.name.toLowerCase().includes(lq))
      .slice(0, 4)
      .map((c: SearchCategory) => ({ type: 'category', label: c.name, to: '/admin/categories', icon: Tag }))

    setHits([...pageHits, ...productHits, ...categoryHits])
    setOpen(true)
  }

  const go = (hit: Hit) => {
    navigate(hit.to)
    setQuery('')
    setHits([])
    setOpen(false)
  }

  const clear = () => { setQuery(''); setHits([]); setOpen(false); inputRef.current?.focus() }

  const groupLabel: Record<string, string> = { page: 'Pages', product: 'Produits', category: 'Catégories' }

  const grouped = hits.reduce<Record<string, Hit[]>>((acc, h) => {
    ;(acc[h.type] ??= []).push(h)
    return acc
  }, {})

  return (
    <div ref={boxRef} className="relative w-full max-w-[280px]">
      <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 h-9 focus-within:border-zinc-400 focus-within:bg-white transition-colors">
        <Search size={14} className="text-zinc-400 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onKeyDown={e => { if (e.key === 'Escape') clear() }}
          placeholder="Rechercher…"
          className="flex-1 bg-transparent text-sm text-zinc-800 placeholder-zinc-400 outline-none w-0"
        />
        {query && (
          <button onClick={clear} className="text-zinc-400 hover:text-zinc-700 transition-colors shrink-0">
            <X size={13} />
          </button>
        )}
      </div>

      {open && hits.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50">
          {Object.entries(grouped).map(([type, group]) => (
            <div key={type}>
              <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                {groupLabel[type]}
              </p>
              {group.map((hit, i) => (
                <button key={i} onClick={() => go(hit)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 transition-colors text-left">
                  <hit.icon size={14} className="text-zinc-400 shrink-0" />
                  <span className="flex-1 text-sm text-zinc-800 truncate">{hit.label}</span>
                  {hit.sub && <span className="text-xs text-zinc-400 shrink-0">{hit.sub}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {open && query && hits.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-lg px-4 py-3 z-50">
          <p className="text-sm text-zinc-400">Aucun résultat pour « {query} »</p>
        </div>
      )}
    </div>
  )
}

const NAV = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/admin/products',   icon: Package,         label: 'Produits'     },
  { to: '/admin/categories', icon: Tag,             label: 'Catégories'   },
  { to: '/admin/media',      icon: Image,           label: 'Médiathèque'  },
  { to: '/admin/settings',   icon: Settings,        label: 'Réglages'     },
  { to: '/admin/contact',        icon: Phone,      label: 'Contact'    },
  { to: '/admin/announcements',  icon: Megaphone,  label: 'Annonces'   },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<{ email: string; avatar: string | null } | null>(null)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  useEffect(() => {
    adminGetProfile().then(setProfile).catch(() => {})
  }, [])

  // Auto-close sidebar on route change
  useEffect(() => {
    setShowMobileSidebar(false)
  }, [location.pathname])

  const logout = () => { clearToken(); navigate('/admin/login') }

  const pageLabel = NAV.find(n => n.to === location.pathname)?.label
    ?? (location.pathname === '/admin/profile' ? 'Mon profil' : '')

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 font-[Manrope,sans-serif]">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-zinc-950 text-white flex flex-col z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0 lg:shrink-0 h-full",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 py-5 border-b border-zinc-800 shrink-0 flex items-center justify-between">
          <div>
            <img src={logo} alt="ProMedias" className="h-8 w-auto object-contain brightness-0 invert" />
            <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-widest font-semibold">Administration</p>
          </div>
          <button className="lg:hidden text-zinc-500 hover:text-white" onClick={() => setShowMobileSidebar(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-3 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === to
                  ? 'bg-[hsl(357,83%,37%)] text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Profile footer */}
        <div className="border-t border-zinc-800 shrink-0">
          <Link to="/admin/profile"
            className={cn(
              'flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors',
              location.pathname === '/admin/profile' ? 'bg-zinc-800' : ''
            )}>
            <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center shrink-0">
              {profile?.avatar
                ? <img src={resolveUrl(profile.avatar)} alt="" className="w-full h-full object-cover" />
                : <User size={13} className="text-zinc-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-300 truncate">{profile?.email ?? '…'}</p>
              <p className="text-[10px] text-zinc-600">Mon profil</p>
            </div>
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-600 hover:text-white border-t border-zinc-800 transition-colors">
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Right column: topbar + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center gap-2 lg:gap-4 px-4 lg:px-6 shrink-0">
          <button 
            className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900"
            onClick={() => setShowMobileSidebar(true)}
          >
            <Menu size={20} />
          </button>
          
          <p className="text-sm font-semibold text-zinc-700 hidden sm:block sm:w-24 lg:w-36 shrink-0">{pageLabel}</p>
          
          <div className="flex-1 flex justify-center">
            <GlobalSearch />
          </div>
          
          <div className="sm:w-24 lg:w-36 flex justify-end shrink-0">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded-lg px-2 lg:px-3 py-1.5 transition-colors">
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Voir le site</span>
            </a>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="admin-layout flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
