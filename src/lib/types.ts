export interface ReviewSpec {
  id: string
  review_id: string
  engine: string | null
  horsepower: number | null
  torque: number | null
  transmission: string | null
  drivetrain: string | null
  fuel_type: string | null
  fuel_economy: string | null
  top_speed: string | null
  acceleration: string | null
  seating: number | null
  price: number | null
}

export interface ReviewGallery {
  id: string
  review_id: string
  image_url: string
  alt_text: string | null
  sort_order: number | null
}

export interface Review {
  id: string
  slug: string
  title: string
  excerpt: string | null
  featured_image: string | null
  manufacturer: string
  model: string
  year: number
  content: Record<string, unknown> | null
  rating: number | null
  status: "draft" | "published"
  featured: boolean
  views: number
  published_at: string | null
  created_by: string
  created_at: string
  updated_at: string | null
  deleted_at: string | null
  specs: ReviewSpec | null
  gallery: ReviewGallery[]
}

export interface Comment {
  id: string
  review_id: string
  author_name: string
  author_email: string | null
  body: string
  status: "approved" | "pending" | "spam"
  created_at: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  pagination?: Pagination
}

export interface ReviewFilters {
  page?: number
  limit?: number
  search?: string
  manufacturer?: string
  minYear?: number
  maxYear?: number
  minRating?: number
}
