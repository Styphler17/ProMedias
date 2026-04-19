// Admin API client — all requests include the JWT token

const IS_DEV   = import.meta.env.DEV
const CMS_URL  = (import.meta.env.VITE_CMS_URL as string) || 'http://localhost:3002'
const API_BASE = IS_DEV ? '/api' : `${CMS_URL}/api`

export const getToken = () => localStorage.getItem('admin_token')
export const setToken = (t: string) => localStorage.setItem('admin_token', t)
export const clearToken = () => localStorage.removeItem('admin_token')
export const isLoggedIn = () => !!getToken()

// --- Types ---

export interface AdminProfile {
  id: number
  email: string
  display_name: string | null
  avatar: string | null
  created_at: string
}

export interface AdminProduct {
  id: number
  name: string
  slug: string
  price: string
  categoryId?: number | string
  condition: string
  conditionScore: number
  specs?: string
  description?: string
  status: string
  image?: string
  gallery?: string[]
  category_name?: string
  deleted_at?: string | null
}

export interface AdminCategory {
  id: number
  name: string
  slug: string
  main_category: string
}

export interface AdminMedia {
  id: number
  filename: string
  url: string
  type: string
  size: number
  category: string
  created_at: string
  deleted_at?: string | null
}

export interface AdminAnnouncement {
  id: number
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  is_active: number | boolean
  created_at: string
}

export interface AdminActivity {
  id: number
  user_id: number
  action_type: 'create' | 'update' | 'delete' | 'restore' | 'purge'
  entity_type: string
  entity_id: number
  details: string | null
  created_at: string
  user_email: string
  display_name: string | null
}

// --- Requests ---

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) { clearToken(); window.location.href = '/admin/login'; throw new Error('Unauthorized') }
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Request failed') }
  return res.json()
}

// Auth
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  const { token } = await res.json()
  setToken(token)
}

export const register = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || 'Failed') }
}

// Profile
export const adminGetProfile    = ()       => req<AdminProfile>('GET', '/auth/me')
export const adminUpdateProfile = (data: { 
  display_name?: string; 
  email?: string; 
  currentPassword?: string; 
  newPassword?: string; 
  avatar?: string | null 
}) => req<AdminProfile>('PUT', '/auth/profile', data)

// Dashboard & Activity
export const adminGetDashboard = () => req<{ activities: AdminActivity[] }>('GET', '/dashboard')
export const adminGetActivity  = () => req<AdminActivity[]>('GET', '/dashboard/activity')

// Products
export const adminGetProducts  = (status = 'all') => req<AdminProduct[]>('GET', `/products?status=${status}`)
export const adminGetProduct   = (id: number)     => req<AdminProduct>('GET', `/products/${id}`)
export const adminCreateProduct = (data: Partial<AdminProduct>) => req<AdminProduct>('POST', '/products', data)
export const adminUpdateProduct = (id: number, data: Partial<AdminProduct>) => req<AdminProduct>('PUT', `/products/${id}`, data)
export const adminDeleteProduct = (id: number)    => req<{ success: boolean }>('DELETE', `/products/${id}`)
export const adminRestoreProduct = (id: number)   => req<{ success: boolean }>('POST', '/products/restore', { id })
export const adminPurgeProduct   = (id: number)   => req<{ success: boolean }>('POST', '/products/purge', { id })

// Categories
export const adminGetCategories   = ()           => req<AdminCategory[]>('GET', '/categories')
export const adminCreateCategory  = (data: Partial<AdminCategory>)  => req<AdminCategory>('POST', '/categories', data)
export const adminUpdateCategory  = (id: number, data: Partial<AdminCategory>) => req<AdminCategory>('PUT', `/categories/${id}`, data)
export const adminDeleteCategory  = (id: number) => req<{ success: boolean }>('DELETE', `/categories/${id}`)

// Settings
export const adminGetSettings    = ()            => req<Record<string,string|null>>('GET', '/settings')
export const adminUpdateSettings = (data: Record<string,any>) => req<{ success: boolean }>('PUT', '/settings', data)

// Announcements
export const adminGetAnnouncements    = ()              => req<AdminAnnouncement[]>('GET', '/announcements/all')
export const adminCreateAnnouncement  = (data: Partial<AdminAnnouncement>) => req<AdminAnnouncement>('POST', '/announcements', data)
export const adminUpdateAnnouncement  = (id: number, data: Partial<AdminAnnouncement>) => req<AdminAnnouncement>('PUT', `/announcements/${id}`, data)
export const adminToggleAnnouncement  = (id: number)   => req<{ success: boolean }>('PATCH', `/announcements/${id}/toggle`)
export const adminDeleteAnnouncement  = (id: number)   => req<{ success: boolean }>('DELETE', `/announcements/${id}`)

// Media library
export const adminGetMedia = (params?: { category?: string; search?: string; sort?: string; status?: string }) => {
  const qs = new URLSearchParams()
  if (params?.category) qs.set('category', params.category)
  if (params?.search)   qs.set('search', params.search)
  if (params?.sort)     qs.set('sort', params.sort)
  if (params?.status)   qs.set('status', params.status)
  const query = qs.toString() ? `?${qs}` : ''
  return req<AdminMedia[]>('GET', `/media${query}`)
}
export const adminUpdateMediaCategory = (id: number, category: string) =>
  req<{ success: boolean }>('PATCH', `/media/${id}`, { category })
export const adminDeleteMedia = (id: number)  => req<{ success: boolean }>('DELETE', `/media/${id}`)
export const adminRestoreMedia = (id: number) => req<{ success: boolean }>('POST', '/media/restore', { id })
export const adminPurgeMedia   = (id: number) => req<{ success: boolean }>('POST', '/media/purge', { id })

// Upload
export const adminUpload = async (file: File, category = 'uncategorized'): Promise<string> => {
  const form = new FormData()
  form.append('file', file)
  form.append('category', category)
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  })
  if (!res.ok) throw new Error('Upload failed')
  const { url } = await res.json()
  const IS_DEV = import.meta.env.DEV
  const CMS_URL = (import.meta.env.VITE_CMS_URL as string) || 'http://localhost:3002'
  return IS_DEV ? url : `${CMS_URL}${url}`
}
