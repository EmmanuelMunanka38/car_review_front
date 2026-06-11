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
  msrp?: number
  weight?: string
  dimensions?: string
  cargo_capacity?: string
  seating_capacity?: number
  safety_rating?: string
  reliability_score?: string
  warranty?: string
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
  content: any
  category?: string
  rating: number | null
  status: "draft" | "published"
  featured: boolean
  views: number
  published_at: string | null
  created_by?: string
  created_at: string
  updated_at?: string | null
  deleted_at?: string | null
  specs: ReviewSpec | null
  gallery: ReviewGallery[]
  pros?: string[]
  cons?: string[]
  features?: string[]
}

export interface Brand {
  id: string
  name: string
  country: string
  founded_year: number
  description: string
  logo: string
  website: string
  total_vehicles: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Editor" | "Moderator" | "Writer"
  status: "active" | "inactive"
  join_date: string
  last_login: string
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

export interface NewsArticle {
  id: string
  url: string
  published_at: string
  title: string
  description: string
  content: string
  image_url: string
  source: {
    name: string
    domain: string
  }
}

export interface NewsApiResponse {
  status: string
  results: NewsArticle[]
  page: number
  has_next_pages: boolean
}

export interface ReviewInput {
  title: string
  manufacturer: string
  model: string
  year: number
  excerpt: string
  content: any
  category?: string
  rating: number
  status: "draft" | "published"
  featured: boolean
  featured_image: string
  specs: Partial<ReviewSpec>
  gallery: { image_url: string; alt_text: string }[]
  pros?: string[]
  cons?: string[]
  features?: string[]
}
