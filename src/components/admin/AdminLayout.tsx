import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Package, Tag, Settings, LogOut, 
  Image, Phone, User, ExternalLink, Search, X, 
  Megaphone, Menu, Trash2, ChevronDown, ChevronRight, ChevronUp 
} from 'lucide-react'
import { clearToken, adminGetProfile, adminGetProducts, adminGetCategories, type AdminCategory } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import { cn } from '@/lib/utils'
import logo from '@/assets/logo.png'

type Hit = { type: 'page' | 'product' | 'category'; label: string; sub?: string; to: string; icon: React.ElementType }

const NAV_PAGES: Hit[] = [
  { type: 'page', label: 'Dashboard',    to: '/admin',            icon: LayoutDashboard },
  { type: 'page', label: 'Produits',     to: '/admin/products',   icon: Package        },
  { type: 'page', label: 'Catégories',   to: '/admin/categories', icon: Tag            },
  { type: 'page', label: 'Utilisateurs', to: '/admin/users',      icon: User           },
  { type: 'page', label: 'Médiathèque',  to: '/admin/media',      icon: Image          },
  { type: 'page', label: 'Corbeille',    to: '/admin/trash',      icon: Trash2         },
  { type: 'page', label: 'Réglages',     to: '/admin/settings',   icon: Settings       },
  { type: 'page', label: 'Contact',      to: '/admin/contact',    icon: Phone          },
  { type: 'page', label: 'Mon profil',   to: '/admin/profile',    icon: User           },
  { type: 'page', label: 'Annonces',    to: '/admin/announcements',  icon: Megaphone },
]

interface SearchProduct {
  id: number
  name: string
  slug: string
  image?: string
}

function GlobalSearch() {
  const navigate = useNavigate()
  const [query, setQuery]           = useState('')
  const [hits, setHits]             = useState<Hit[]>([])
  const [open, setOpen]             = useState(false)
  const [products, setProducts]     = useState<SearchProduct[] | null>(null)
  const [categories, setCategories] = useState<AdminCategory[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
      .filter((c: AdminCategory) => c.name.toLowerCase().includes(lq))
      .slice(0, 4)
      .map((c: AdminCategory) => ({ type: 'category', label: c.name, to: `/admin/products?category_id=${c.id}`, icon: Tag }))

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
    </div>
  )
}

const NAV_TOP = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/admin/products',   icon: Package,         label: 'Produits'     },
]

const NAV_BOTTOM = [
  { to: '/admin/users',      icon: User,            label: 'Utilisateurs' },
  { to: '/admin/media',      icon: Image,           label: 'Médiathèque'  },
  { to: '/admin/settings',   icon: Settings,        label: 'Réglages'     },
  { to: '/admin/contact',    icon: Phone,           label: 'Contact'      },
  { to: '/admin/announcements', icon: Megaphone,    label: 'Annonces'     },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [profile, setProfile]       = useState<{ display_name: string | null; email: string; avatar: string | null; role?: string } | null>(null)
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [showTop, setShowTop]       = useState(false)
  const searchParams = new URLSearchParams(location.search)
  const activeCatId  = searchParams.get('category_id')

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const [showCatDropdown, setShowCatDropdown] = useState(() => 
    location.pathname.startsWith('/admin/products') && !!activeCatId
  )
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  useEffect(() => {
    adminGetProfile().then(setProfile).catch(() => {})
    adminGetCategories().then(setCategories).catch(() => {})
  }, [])

  const logout = () => { clearToken(); navigate('/admin/login') }

  const activeLabel = NAV_TOP.find(n => n.to === location.pathname)?.label
    || NAV_BOTTOM.find(n => n.to === location.pathname)?.label
    || (location.pathname === '/admin/trash' ? 'Corbeille' : '')
    || (location.pathname === '/admin/profile' ? 'Mon profil' : '')
    || (location.pathname === '/admin/categories' ? 'Gestion Catégories' : '')
    || ''

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 font-[Manrope,sans-serif]">
      {showMobileSidebar && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-zinc-950 text-white flex flex-col z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0 lg:shrink-0 h-full",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 py-5 border-b border-zinc-800 shrink-0 flex items-center justify-between">
          <div>
            <img src={logo} alt="ProMedias" className="h-8 w-auto object-contain brightness-0 invert" />
            <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-widest font-semibold text-center">Administration</p>
          </div>
          <button className="lg:hidden text-zinc-500 hover:text-white" onClick={() => setShowMobileSidebar(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-3 overflow-y-auto">
          {/* Dashboard & Products */}
          {NAV_TOP.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setShowMobileSidebar(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === to ? 'bg-[hsl(357,83%,37%)] text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}>
              <Icon size={16} />
              {label}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <div className="space-y-1">
            <button 
              onClick={() => setShowCatDropdown(!showCatDropdown)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname.startsWith('/admin/categories') ? 'text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              <div className="flex items-center gap-3">
                <Tag size={16} />
                Catégories
              </div>
              {showCatDropdown ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {showCatDropdown && (
              <div className="pl-9 space-y-1 py-1 animate-in slide-in-from-top-2 duration-200">
                <Link to="/admin/categories" onClick={() => setShowMobileSidebar(false)}
                  className="block text-xs font-bold text-zinc-500 hover:text-white py-1.5 uppercase tracking-wider">
                  Gérer tout
                </Link>
                {categories.map(cat => {
                  const isActive = activeCatId === cat.id.toString()
                  return (
                    <Link 
                      key={cat.id} 
                      to={`/admin/products?category_id=${cat.id}`}
                      onClick={() => setShowMobileSidebar(false)}
                      className={cn(
                        "block text-sm py-1.5 transition-all truncate pr-2 relative",
                        isActive 
                          ? "text-[hsl(357,83%,37%)] font-bold translate-x-1" 
                          : "text-zinc-400 hover:text-white"
                      )}
                    >
                      {isActive && (
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-3 bg-[hsl(357,83%,37%)] rounded-full shadow-[0_0_8px_rgba(152,11,18,0.4)]" />
                      )}
                      {cat.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Middle Nav */}
          {NAV_BOTTOM.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setShowMobileSidebar(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === to ? 'bg-[hsl(357,83%,37%)] text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}>
              <Icon size={16} />
              {label}
            </Link>
          ))}

          {/* Divider & Trash at the bottom */}
          <div className="pt-6 mt-4 border-t border-zinc-800">
            <Link to="/admin/trash" onClick={() => setShowMobileSidebar(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === '/admin/trash' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800/50'
              )}>
              <Trash2 size={16} />
              Corbeille
            </Link>
          </div>
        </nav>

        <div className="border-t border-zinc-800 shrink-0">
          <Link to="/admin/profile" onClick={() => setShowMobileSidebar(false)}
            className={cn('flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors', location.pathname === '/admin/profile' ? 'bg-zinc-800' : '')}>
            <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center shrink-0 border border-zinc-700">
              {profile?.avatar ? <img src={resolveUrl(profile.avatar)} alt="" className="w-full h-full object-cover" /> : <User size={13} className="text-zinc-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-300 truncate font-semibold">{profile?.display_name || profile?.email || '…'}</p>
              <p className="text-[10px] text-zinc-600">Mon profil</p>
            </div>
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-600 hover:text-white border-t border-zinc-800 transition-colors">
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center gap-2 lg:gap-4 px-4 lg:px-6 shrink-0">
          <button className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900" onClick={() => setShowMobileSidebar(true)}>
            <Menu size={20} />
          </button>
          <p className="text-sm font-bold text-zinc-800 hidden sm:block sm:w-24 lg:w-40 shrink-0 uppercase tracking-widest">{activeLabel}</p>
          <div className="flex-1 flex justify-center">
            <GlobalSearch />
          </div>
          <div className="sm:w-24 lg:w-40 flex justify-end shrink-0">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded-lg px-2 lg:px-3 py-1.5 transition-all shadow-sm">
              <ExternalLink size={13} />
              <span className="hidden sm:inline uppercase tracking-tighter">Voir le site</span>
            </a>
          </div>
        </header>

        <main className="admin-layout flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>

      {showTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-9 h-9 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-800 transition-all hover:scale-110 animate-in fade-in zoom-in duration-200 z-[60]"
        >
          <ChevronUp size={16} />
        </button>
      )}
    </div>
  )
}
