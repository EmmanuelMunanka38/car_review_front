import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { TrendingCars } from "@/components/sections/TrendingCars"
import { EditorialGrid } from "@/components/sections/EditorialGrid"
import { Button } from "@/components/ui/Button"
import { getReviews } from "@/lib/api"
import type { Review } from "@/lib/types"
import { CATEGORY_IMAGES } from "@/lib/constants"

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    getReviews({ limit: 8 })
      .then((res) => setReviews(res.data))
  }, [])

  const categories = [
    { name: "SUV", image: CATEGORY_IMAGES.SUV },
    { name: "Sedan", image: CATEGORY_IMAGES.Sedan },
    { name: "Sports", image: CATEGORY_IMAGES.Sports },
    { name: "Electric", image: CATEGORY_IMAGES.Electric },
  ]

  return (
    <div className="min-h-screen bg-background font-inter selection:bg-primary selection:text-white">
      <Header />
      <main>
        <Hero reviews={reviews} />

        {/* Quick Filters */}
        <section className="bg-foreground text-background py-4">
          <div className="px-6 md:px-12 max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar py-2">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">Filters:</span>
              <Link to="/cars?sort=price-asc" className="text-xs font-mono hover:text-primary transition-colors whitespace-nowrap uppercase tracking-widest font-bold">Price Low-High</Link>
              <Link to="/cars?sort=horsepower" className="text-xs font-mono hover:text-primary transition-colors whitespace-nowrap uppercase tracking-widest font-bold">Horsepower</Link>
              <Link to="/cars?sort=top-speed" className="text-xs font-mono hover:text-primary transition-colors whitespace-nowrap uppercase tracking-widest font-bold">Top Speed</Link>
              <Link to="/cars?sort=range" className="text-xs font-mono hover:text-primary transition-colors whitespace-nowrap uppercase tracking-widest font-bold">Range</Link>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
              <span className="opacity-60 uppercase tracking-widest">Trending now:</span>
              <span className="font-bold border-b border-primary uppercase tracking-widest">
                {reviews[0] ? `${reviews[0].manufacturer} ${reviews[0].model}` : "BYD Yangwang U9"}
              </span>
            </div>
          </div>
        </section>

        <TrendingCars reviews={reviews} />
        <EditorialGrid reviews={reviews} />

        {/* Categories Section */}
        <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto">
          <h2 className="text-4xl font-archivo font-extrabold mb-12 uppercase tracking-tight">BY CATEGORY</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const count = reviews.filter((r) => r.manufacturer).length
              return (
                <Link
                  key={cat.name}
                  to={`/cars?manufacturer=${cat.name}`}
                  className="group relative h-64 overflow-hidden border border-border"
                >
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={cat.image} alt={cat.name} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-sm font-mono font-bold uppercase tracking-[0.2em]">{cat.name}</span>
                    <span className="block text-[10px] font-mono text-white/60 mt-1">{count} vehicles</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-muted/50 border-t border-border">
          <div className="px-6 md:px-12 max-w-[800px] mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-archivo font-extrabold mb-4 uppercase tracking-tight">JOIN THE ELITE</h2>
            <p className="text-muted-foreground mb-12 font-inter">
              Get first access to our deep-dive reviews and industry analysis twice a week.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 px-6 py-4 bg-background border border-border focus:border-primary focus:ring-0 text-sm font-mono outline-none"
                placeholder="YOUR EMAIL ADDRESS"
                type="email"
              />
              <Button className="px-12 py-4 text-sm font-mono font-bold uppercase tracking-widest">
                SUBSCRIBE
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
