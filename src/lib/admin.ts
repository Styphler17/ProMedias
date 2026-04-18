// Admin API client — all requests include the JWT token

const IS_DEV   = import.meta.env.DEV
const CMS_URL  = (import.meta.env.VITE_CMS_URL as string) || 'http://localhost:3002'
const API_BASE = IS_DEV ? '/api' : `${CMS_URL}/api`

export const getToken = () => localStorage.getItem('admin_token')
export const setToken = (t: string) => localStorage.setItem('admin_token', t)
export const clearToken = () => localStorage.removeItem('admin_token')
export const isLoggedIn = () => !!getToken()

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
export const adminGetProfile    = ()       => req<any>('GET', '/auth/me')
export const adminUpdateProfile = (data: { email?: string; currentPassword?: string; newPassword?: string; avatar?: string | null }) =>
  req<any>('PUT', '/auth/profile', data)

// Products
export const adminGetProducts  = ()        => req<any[]>('GET', '/products?status=all')
export const adminGetProduct   = (id: number) => req<any>('GET', `/products/${id}`)
export const adminCreateProduct = (data: any) => req<any>('POST', '/products', data)
export const adminUpdateProduct = (id: number, data: any) => req<any>('PUT', `/products/${id}`, data)
export const adminDeleteProduct = (id: number) => req<any>('DELETE', `/products/${id}`)

// Categories
export const adminGetCategories   = ()           => req<any[]>('GET', '/categories')
export const adminCreateCategory  = (data: any)  => req<any>('POST', '/categories', data)
export const adminUpdateCategory  = (id: number, data: any) => req<any>('PUT', `/categories/${id}`, data)
export const adminDeleteCategory  = (id: number) => req<any>('DELETE', `/categories/${id}`)

// Settings
export const adminGetSettings    = ()            => req<Record<string,string|null>>('GET', '/settings')
export const adminUpdateSettings = (data: any)   => req<any>('PUT', '/settings', data)

// Announcements
export const adminGetAnnouncements    = ()              => req<any[]>('GET', '/announcements/all')
export const adminCreateAnnouncement  = (data: any)     => req<any>('POST', '/announcements', data)
export const adminUpdateAnnouncement  = (id: number, data: any) => req<any>('PUT', `/announcements/${id}`, data)
export const adminToggleAnnouncement  = (id: number)   => req<any>('PATCH', `/announcements/${id}/toggle`)
export const adminDeleteAnnouncement  = (id: number)   => req<any>('DELETE', `/announcements/${id}`)

// Media library
export const adminGetMedia = (params?: { category?: string; search?: string; sort?: string }) => {
  const qs = new URLSearchParams()
  if (params?.category) qs.set('category', params.category)
  if (params?.search)   qs.set('search', params.search)
  if (params?.sort)     qs.set('sort', params.sort)
  const query = qs.toString() ? `?${qs}` : ''
  return req<any[]>('GET', `/media${query}`)
}
export const adminUpdateMediaCategory = (id: number, category: string) =>
  req<any>('PATCH', `/media/${id}`, { category })
export const adminDeleteMedia = (id: number) => req<any>('DELETE', `/media/${id}`)

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
