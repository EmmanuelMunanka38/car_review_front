import type { Review, ApiResponse, ReviewFilters, Comment, NewsApiResponse, ReviewInput } from "./types"
import { CHINESE_BRANDS } from "./constants"

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "")
const TOKEN_KEY = "fa_auth_token"

function getAuthToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function setAuthToken(token: string): void {
  try { localStorage.setItem(TOKEN_KEY, token) } catch { /* noop */ }
}

export function clearAuthToken(): void {
  try { localStorage.removeItem(TOKEN_KEY) } catch { /* noop */ }
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { "Authorization": `Bearer ${token}` } : {}
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> || {}) },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Public Review Endpoints ──

export async function getReviews(filters: ReviewFilters = {}): Promise<ApiResponse<Review[]>> {
  try {
    const params = new URLSearchParams()
    if (filters.page) params.set("page", String(filters.page))
    if (filters.limit) params.set("limit", String(filters.limit))
    if (filters.search) params.set("search", filters.search)
    if (filters.manufacturer) params.set("manufacturer", filters.manufacturer)
    if (filters.minYear) params.set("minYear", String(filters.minYear))
    if (filters.maxYear) params.set("maxYear", String(filters.maxYear))
    if (filters.minRating) params.set("minRating", String(filters.minRating))
    const qs = params.toString()
    return await fetchApi<ApiResponse<Review[]>>(`/api/reviews${qs ? `?${qs}` : ""}`)
  } catch (err) {
    console.warn("getReviews: backend unavailable, using mock data:", (err as Error).message)
    return fallbackReviews(filters)
  }
}

export async function getFeaturedReviews(page = 1, limit = 10): Promise<ApiResponse<Review[]>> {
  try {
    return await fetchApi<ApiResponse<Review[]>>(`/api/reviews/featured?page=${page}&limit=${limit}`)
  } catch (err) {
    console.warn("getFeaturedReviews: backend unavailable, using mock data:", (err as Error).message)
    return fallbackReviews({ page, limit })
  }
}

export async function getReviewBySlug(slug: string): Promise<ApiResponse<Review>> {
  try {
    return await fetchApi<ApiResponse<Review>>(`/api/reviews/${encodeURIComponent(slug)}`)
  } catch (err) {
    console.warn("getReviewBySlug: backend unavailable, using mock data:", (err as Error).message)
    const { MOCK_REVIEWS } = await import("./mockData")
    const found = (MOCK_REVIEWS as unknown as Review[]).find(r => r.slug === slug || r.id === slug)
    if (found) return { success: true, data: found }
    throw new Error("Review not found")
  }
}

// ── Public Comment Endpoints ──

export async function getComments(reviewId: string, page = 1, limit = 20): Promise<ApiResponse<Comment[]>> {
  return fetchApi<ApiResponse<Comment[]>>(`/api/reviews/${reviewId}/comments?page=${page}&limit=${limit}`)
}

export async function createComment(reviewId: string, data: { author_name: string; author_email?: string; body: string }): Promise<ApiResponse<Comment>> {
  return fetchApi<ApiResponse<Comment>>(`/api/reviews/${reviewId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ── Makes ──

export async function getMakes(): Promise<string[]> {
  try {
    const res = await getReviews({ limit: 100 })
    const makes = [...new Set(res.data.map(r => r.manufacturer).filter(Boolean))]
    return makes.sort()
  } catch {
    return [...CHINESE_BRANDS]
  }
}

// ── Admin Review Endpoints ──

export async function createReview(data: ReviewInput): Promise<ApiResponse<Review>> {
  return fetchApi<ApiResponse<Review>>("/api/admin/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateReview(id: string, data: Partial<ReviewInput>): Promise<ApiResponse<Review>> {
  return fetchApi<ApiResponse<Review>>(`/api/admin/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteReview(id: string): Promise<ApiResponse<void>> {
  return fetchApi<ApiResponse<void>>(`/api/admin/reviews/${id}`, {
    method: "DELETE",
  })
}

export async function restoreReview(id: string): Promise<ApiResponse<Review>> {
  return fetchApi<ApiResponse<Review>>(`/api/admin/reviews/${id}/restore`, {
    method: "POST",
  })
}

export async function adminGetReviews(filters: { page?: number; limit?: number; status?: string; search?: string; includeDeleted?: boolean } = {}): Promise<ApiResponse<Review[]>> {
  const params = new URLSearchParams()
  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.status) params.set("status", filters.status)
  if (filters.search) params.set("search", filters.search)
  if (filters.includeDeleted) params.set("includeDeleted", "true")
  const qs = params.toString()
  return fetchApi<ApiResponse<Review[]>>(`/api/admin/reviews${qs ? `?${qs}` : ""}`)
}

// ── Admin Comment Endpoints ──

export async function adminGetComments(filters: { page?: number; limit?: number; status?: string } = {}): Promise<ApiResponse<Comment[]>> {
  const params = new URLSearchParams()
  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.status) params.set("status", filters.status)
  const qs = params.toString()
  return fetchApi<ApiResponse<Comment[]>>(`/api/admin/comments${qs ? `?${qs}` : ""}`)
}

export async function moderateComment(id: string, status: "approved" | "pending" | "spam"): Promise<ApiResponse<Comment>> {
  return fetchApi<ApiResponse<Comment>>(`/api/admin/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

export async function adminDeleteComment(id: string): Promise<ApiResponse<void>> {
  return fetchApi<ApiResponse<void>>(`/api/admin/comments/${id}`, {
    method: "DELETE",
  })
}

// ── Upload ──

export async function uploadImage(file: File, manufacturer = "unknown", model = "unknown"): Promise<ApiResponse<{ url: string }>> {
  const formData = new FormData()
  formData.append("image", file)
  formData.append("manufacturer", manufacturer)
  formData.append("model", model)

  const token = getAuthToken()
  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}/api/upload/image`, {
    method: "POST",
    headers,
    body: formData,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Upload failed" }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── News ──

export async function getNews(page = 1, perPage = 10): Promise<NewsApiResponse> {
  const res = await fetchApi<NewsApiResponse>(`/api/news?page=${page}&perPage=${perPage}`)
  return res
}

// ── Fallback ──

async function fallbackReviews(filters: ReviewFilters = {}): Promise<ApiResponse<Review[]>> {
  const { MOCK_REVIEWS } = await import("./mockData")
  let data = [...MOCK_REVIEWS] as unknown as Review[]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    data = data.filter(r =>
      r.manufacturer.toLowerCase().includes(q) ||
      r.model.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q)
    )
  }
  if (filters.manufacturer) {
    const m = filters.manufacturer.toLowerCase()
    data = data.filter(r => r.manufacturer.toLowerCase().includes(m))
  }
  const page = filters.page || 1
  const limit = filters.limit || 10
  return {
    success: true,
    data: data.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total: data.length },
  }
}
