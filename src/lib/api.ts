import type { Review, ApiResponse, ReviewFilters, Comment, NewsApiResponse, ReviewInput } from "./types"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/"
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const NEWS_API_URL = "https://api.apitube.io/v1/news/everything"

const CARAPI_URL = "https://api.carapi.dev/v1"
const CARAPI_KEY = "carapi_b24222826f0600819018efac4ec1978f"

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

// Adapt an external vehicle/listing object to the app's internal Review type.
function adaptVehicleToReview(v: any): Review {
  const spec = v.specifications || {}
  const manufacturer = spec.make || "Unknown"
  const model = spec.model || ""
  const regDate = spec.registrationDate ? new Date(spec.registrationDate) : new Date()
  const year = regDate.getFullYear()
  const id = v.vin || String(Math.random())
  const title = `${year} ${manufacturer} ${model}`.trim()
  const slugBase = `${manufacturer}-${model}-${id}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-")

  const FALLBACK = "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&q=80"
  const featured_image = (v.images && v.images.length > 0) ? v.images[0].url : FALLBACK

  const specs: any = {
    id: `spec-${id}`,
    review_id: `rev-${id}`,
    engine: spec.engine || null,
    horsepower: spec.power ? parseInt(spec.power) : null,
    torque: null,
    transmission: spec.transmission || null,
    drivetrain: spec.drivetrain || null,
    fuel_type: spec.fuel || null,
    fuel_economy: null,
    top_speed: null,
    acceleration: null,
    seating: null,
    price: v.price || null,
  }

  const review: Review = {
    id,
    slug: slugBase,
    title,
    excerpt: `${manufacturer} ${model} - ${spec.body || ""} ${spec.fuel || ""} ${spec.transmission || ""}`,
    featured_image,
    manufacturer,
    model,
    year,
    content: v,
    category: spec.body || spec.fuel || null,
    rating: 8.5,
    status: "published",
    featured: false,
    views: Math.floor(Math.random() * 1000),
    published_at: spec.registrationDate || null,
    created_at: new Date().toISOString(),
    specs,
    gallery: (v.images && v.images.length > 0) ? v.images.map((img: any, i: number) => ({
      id: `${id}-img-${i}`,
      review_id: `rev-${id}`,
      image_url: img.url,
      alt_text: title,
      sort_order: i
    })) : [],
  }

  return review
}

async function fetchCarApiList(params: Record<string, string> = {}): Promise<{ data: any[], total: number }> {
  const queryParams = new URLSearchParams({
    token: CARAPI_KEY,
    limit: "20",
    ...params
  })
  
  const url = `${CARAPI_URL}/listing?${queryParams.toString()}`
  console.log("fetchCarApiList fetching", url)
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        "Accept": "application/json"
      }
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      console.log("fetchCarApiList failed", res.status, errorText)
      throw new Error(`CarAPI fetch failed: ${res.status}`)
    }
    
    const json = await res.json()
    return {
      data: json.listings || [],
      total: json.pagination?.total || (json.listings?.length || 0)
    }
  } catch (err) {
    console.log("fetchCarApiList network/cors error:", err)
    throw err
  }
}

export async function getMakes(): Promise<string[]> {
  try {
    const { data } = await fetchCarApiList({ limit: "100" })
    const makes = new Set(data.map(v => v.specifications?.make).filter(Boolean))
    return Array.from(makes).sort() as string[]
  } catch (err) {
    console.log("Failed to fetch makes from listings:", err)
    return []
  }
}

export async function getReviews(filters: ReviewFilters = {}): Promise<ApiResponse<Review[]>> {
  try {
    const params: Record<string, string> = {}
    if (filters.page) params.offset = String(((filters.page || 1) - 1) * (filters.limit || 20))
    if (filters.limit) params.limit = String(filters.limit)
    if (filters.manufacturer) params.make = filters.manufacturer
    
    const { data, total } = await fetchCarApiList(params)
    console.log("Car API data received:", data.length, "items")
    const reviews = data.map(adaptVehicleToReview)
    
    if (reviews.length > 0) {
      return { 
        success: true, 
        data: reviews, 
        pagination: { 
          page: filters.page || 1, 
          limit: filters.limit || 20, 
          total: total
        } 
      }
    }
    console.warn("Car API returned empty list, falling back to mock data")
  } catch (err) {
    console.error("Car API fetch failed error details:", err)
  }

  try {
    const { MOCK_REVIEWS } = await import("./mockData")
    let data = MOCK_REVIEWS as unknown as Review[]
    if (filters.manufacturer) {
      data = data.filter(r => r.manufacturer.toLowerCase().includes(filters.manufacturer?.toLowerCase() || ""))
    }
    const page = filters.page || 1
    const limit = filters.limit || 10
    return {
      success: true,
      data: data.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total: data.length }
    }
  } catch (e) {
    return { success: false, data: [] }
  }
}

export async function getFeaturedReviews(page = 1, limit = 10): Promise<ApiResponse<Review[]>> {
  return getReviews({ page, limit })
}

export async function getReviewBySlug(slug: string): Promise<ApiResponse<Review>> {
  try {
    const parts = slug.split("-")
    const vin = parts[parts.length - 1]
    
    const { data } = await fetchCarApiList({ limit: "100" })
    const found = data.find(v => v.vin === vin)
    if (found) return { success: true, data: adaptVehicleToReview(found) }
    
    const reviews = data.map(adaptVehicleToReview)
    const foundBySlug = reviews.find(r => r.slug === slug)
    if (foundBySlug) return { success: true, data: foundBySlug }
  } catch (err) {
    console.error("Car API detail fetch failed:", err)
  }

  try {
    const { MOCK_REVIEWS } = await import("./mockData")
    const found = (MOCK_REVIEWS as unknown as Review[]).find(r => r.slug === slug || r.id === slug)
    if (found) return { success: true, data: found }
  } catch (e) {}
  
  throw new Error("Review not found")
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
