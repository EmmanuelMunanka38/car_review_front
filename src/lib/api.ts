import type { Review, ApiResponse, ReviewFilters, Comment, NewsApiResponse, ReviewInput } from "./types"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/"
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const NEWS_API_URL = "https://api.apitube.io/v1/news/everything"

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Network error" }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function getReviews(filters: ReviewFilters = {}): Promise<ApiResponse<Review[]>> {
  const params = new URLSearchParams()
  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.search) params.set("search", filters.search)
  if (filters.manufacturer) params.set("manufacturer", filters.manufacturer)
  if (filters.minYear) params.set("minYear", String(filters.minYear))
  if (filters.maxYear) params.set("maxYear", String(filters.maxYear))
  if (filters.minRating) params.set("minRating", String(filters.minRating))
  const qs = params.toString()
  return fetchApi<ApiResponse<Review[]>>(`/reviews${qs ? `?${qs}` : ""}`)
}

export async function getFeaturedReviews(page = 1, limit = 10): Promise<ApiResponse<Review[]>> {
  return fetchApi<ApiResponse<Review[]>>(`/reviews/featured?page=${page}&limit=${limit}`)
}

export async function getReviewBySlug(slug: string): Promise<ApiResponse<Review>> {
  return fetchApi<ApiResponse<Review>>(`/reviews/${encodeURIComponent(slug)}`)
}

export async function getComments(
  reviewId: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<Comment[]>> {
  return fetchApi<ApiResponse<Comment[]>>(`/reviews/${reviewId}/comments?page=${page}&limit=${limit}`)
}

export async function createComment(
  reviewId: string,
  data: { author_name: string; author_email?: string; body: string }
): Promise<ApiResponse<Comment>> {
  return fetchApi<ApiResponse<Comment>>(`/reviews/${reviewId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function createReview(data: ReviewInput): Promise<ApiResponse<Review>> {
  return fetchApi<ApiResponse<Review>>("/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteReview(id: string): Promise<ApiResponse<void>> {
  return fetchApi<ApiResponse<void>>(`/reviews/${id}`, {
    method: "DELETE",
  })
}

export async function getNews(page = 1, perPage = 10): Promise<NewsApiResponse> {
  const url = new URL(NEWS_API_URL)
  url.searchParams.set("api_key", NEWS_API_KEY)
  url.searchParams.set("q", "cars OR automotive OR electric vehicles")
  url.searchParams.set("page", String(page))
  url.searchParams.set("per_page", String(perPage))

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`News API error: ${res.status}`)
  }
  return res.json()
}
