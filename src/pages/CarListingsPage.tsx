import { useState, useEffect, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { FiGrid, FiList, FiHeart } from "react-icons/fi"
import { getReviews, getMakes } from "@/lib/api"
import type { Review } from "@/lib/types"
import { FALLBACK_IMAGE, PROMO_IMAGE } from "@/lib/constants"
import { Reveal } from "@/components/ui/Reveal"

const SORT_OPTIONS = [
  { value: "newest", label: "Sort by: Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "performance", label: "Performance: 0-60 MPH" },
]

export default function CarListingsPage() {
  const [searchParams] = useSearchParams()
  const [reviews, setReviews] = useState<Review[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const m = searchParams.get("manufacturer")
    return m ? m.split(",") : []
  })
  const [sort, setSort] = useState(searchParams.get("sort") || "newest")
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1)
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 500000])
  const [selectedBody, setSelectedBody] = useState<string | null>(null)
  const [selectedDrivetrain, setSelectedDrivetrain] = useState<string | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const limit = 9

  useEffect(() => {
    getMakes().then(res => {
      if (res.length > 0) {
        setBrands(res)
      } else {
        // Fallback to constants if API fails
        import("@/lib/constants").then(m => setBrands(m.CHINESE_BRANDS))
      }
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const manufacturer = selectedBrands.length > 0 ? selectedBrands[0] : undefined

    getReviews({ page, limit, manufacturer, search: searchQuery || undefined })
      .then((res) => {
        let data = res.data || []
        if (selectedBrands.length > 1) {
          data = data.filter(r => selectedBrands.includes(r.manufacturer))
        }
        setReviews(data)
        setTotal(res.pagination?.total || data.length || 0)
      })
      .catch((err) => {
        console.error("API Error in CarListingsPage:", err)
        setReviews([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [selectedBrands, page, limit, searchQuery])

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
    setPage(1)
  }

  const clearAll = () => {
    setSearchQuery("")
    setSelectedBrands([])
    setPriceRange([50000, 500000])
    setSelectedBody(null)
    setSelectedDrivetrain(null)
    setSelectedFeatures([])
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (r.specs?.price != null && (r.specs.price < priceRange[0] || r.specs.price > priceRange[1])) return false
      if (selectedDrivetrain && r.specs?.drivetrain?.toLowerCase() !== selectedDrivetrain.toLowerCase()) return false
      return true
    })
  }, [reviews, priceRange, selectedDrivetrain])

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sort) {
      case "price-asc": return (a.specs?.price || 0) - (b.specs?.price || 0)
      case "price-desc": return (b.specs?.price || 0) - (a.specs?.price || 0)
      case "performance": {
        const aVal = a.specs?.acceleration ? parseFloat(a.specs.acceleration) : 99
        const bVal = b.specs?.acceleration ? parseFloat(b.specs.acceleration) : 99
        return aVal - bVal
      }
      default: return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-background text-on-surface font-inter selection:bg-primary selection:text-white">
      <Header />
      <main className="max-w-[1280px] mx-auto px-6 md:px-12 py-8 min-h-screen">
        {/* Header Section */}
        <Reveal animation="fade-down" duration={500}>
          <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-archivo font-extrabold uppercase tracking-tight">Current Inventory</h1>
              <p className="text-xs font-mono text-muted-foreground mt-2">
                SHOWING {reviews.length} OF {total} HIGH-PERFORMANCE VEHICLES
              </p>
            </div>
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="flex border border-border rounded p-1 bg-muted/20">
                <button className="p-2 bg-background shadow-sm rounded-sm"><FiGrid className="text-xl" /></button>
                <button className="p-2 text-muted-foreground hover:bg-background rounded-sm transition-all"><FiList className="text-xl" /></button>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-background border border-border text-xs font-mono px-4 py-2 min-w-[200px] outline-none focus:ring-2 focus:ring-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </header>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
            <Reveal animation="fade-right" delay={200}>
              <div className="sticky top-24">
                <div className="flex justify-between items-center mb-6 border-b-2 border-foreground pb-2">
                  <h2 className="text-xs font-mono uppercase font-bold">Refine Results</h2>
                  <button onClick={clearAll} className="text-xs font-mono text-primary hover:underline">Clear All</button>
                </div>
                <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {/* Brand */}
                  <section>
                    <h3 className="text-xs font-mono mb-3 text-muted-foreground uppercase">Manufacturer</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                            type="checkbox"
                          />
                          <span className="text-sm group-hover:text-primary transition-colors">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* Price Range */}
                  <section>
                    <h3 className="text-xs font-mono mb-3 text-muted-foreground uppercase">Price Range</h3>
                    <div className="space-y-4">
                      <input className="w-full accent-primary" max="500000" min="50000" step="10000" type="range"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      />
                      <div className="flex justify-between text-xs font-mono">
                        <span>${(priceRange[0] / 1000).toFixed(0)}k</span>
                        <span className="text-primary font-bold">${(priceRange[1] / 1000).toFixed(0)}k+</span>
                      </div>
                    </div>
                  </section>

                  {/* Body Style */}
                  <section>
                    <h3 className="text-xs font-mono mb-3 text-muted-foreground uppercase">Body Style</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Coupe", "Sedan", "SUV", "Convertible"].map((style) => (
                        <button key={style}
                          className={`border py-2 text-xs font-mono transition-colors ${
                            selectedBody === style
                              ? 'border-primary bg-primary/10 text-primary font-bold'
                              : 'border-border hover:bg-muted/30'
                          }`}
                          onClick={() => setSelectedBody(selectedBody === style ? null : style)}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Drivetrain */}
                  <section>
                    <h3 className="text-xs font-mono mb-3 text-muted-foreground uppercase">Drivetrain</h3>
                    <div className="space-y-2">
                      {["Rear-Wheel Drive", "All-Wheel Drive"].map((dt) => (
                        <label key={dt} className="flex items-center gap-3 cursor-pointer">
                          <input className="w-4 h-4 border-border text-primary focus:ring-primary" name="drivetrain" type="radio"
                            checked={selectedDrivetrain === dt}
                            onChange={() => setSelectedDrivetrain(selectedDrivetrain === dt ? null : dt)}
                          />
                          <span className="text-sm">{dt}</span>
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* Features */}
                  <section>
                    <h3 className="text-xs font-mono mb-3 text-muted-foreground uppercase">Key Features</h3>
                    <div className="space-y-2">
                      {["Carbon Ceramic Brakes", "Adaptive Suspension"].map((feature) => (
                        <label key={feature} className="flex items-center gap-3 cursor-pointer">
                          <input className="w-4 h-4 rounded border-border text-primary focus:ring-primary" type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => setSelectedFeatures(prev =>
                              prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
                            )}
                          />
                          <span className="text-sm">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </Reveal>
          </aside>

          {/* Results */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-background border border-border overflow-hidden animate-pulse">
                    <div className="h-64 bg-muted/30" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-muted/30 rounded w-1/3" />
                      <div className="h-6 bg-muted/30 rounded w-2/3" />
                      <div className="h-12 bg-muted/20 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedReviews.length === 0 ? (
              <Reveal animation="zoom-in">
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <span className="text-6xl text-muted-foreground mb-6">🔍</span>
                  <h2 className="text-3xl font-archivo font-bold mb-2">NO VEHICLES FOUND</h2>
                  <p className="text-sm text-muted-foreground max-w-sm mb-8">
                    Adjust your filters or clear all selections to browse our full inventory of elite machinery.
                  </p>
                  <Button onClick={clearAll} className="px-8 py-3 text-xs font-mono uppercase tracking-widest">
                    Clear All Filters
                  </Button>
                </div>
              </Reveal>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedReviews.map((v, idx) => (
                    <Reveal key={v.id} animation="fade-up" delay={idx * 50}>
                      <Link
                        to={`/cars/${v.slug}`}
                        className="bg-background border border-border overflow-hidden group hover:border-foreground transition-all flex flex-col h-full"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={v.featured_image || FALLBACK_IMAGE}
                            alt={v.title}
                          />
                          {v.featured && (
                            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-xs font-mono uppercase">
                              Featured
                            </div>
                          )}
                          <button className="absolute top-4 right-4 w-10 h-10 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                            <FiHeart />
                          </button>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="mb-4">
                            <h4 className="text-xs font-mono text-primary uppercase mb-1">{v.manufacturer}</h4>
                            <h3 className="text-2xl font-archivo font-bold leading-tight">{v.model}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4 border-y border-border py-4 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono font-bold">{v.specs?.horsepower ? `${v.specs.horsepower} HP` : "—"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono font-bold">{v.specs?.acceleration ? `${v.specs.acceleration} 0-60` : "—"}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-auto">
                            <span className="text-2xl font-archivo font-bold">
                              {v.specs?.price ? `$${v.specs.price.toLocaleString()}` : "Contact"}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground">{v.year}</span>
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  ))}

                  {/* Promo Card */}
                  <Reveal animation="zoom-in" delay={300}>
                    <div className="relative bg-foreground p-8 flex flex-col justify-center text-white overflow-hidden group h-full min-h-[350px]">
                      <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
                        <img
                          className="w-full h-full object-cover grayscale"
                          src={PROMO_IMAGE}
                          alt=""
                        />
                      </div>
                      <div className="relative z-10 text-center">
                        <h2 className="text-4xl font-archivo font-extrabold leading-none mb-4 italic">BESPOKE SERVICES</h2>
                        <p className="text-sm text-white/60 mb-8 mx-auto max-w-[240px]">
                          Can't find your dream spec? Our acquisition team sources worldwide.
                        </p>
                        <button className="border-2 border-primary text-primary text-xs font-mono px-8 py-3 hover:bg-primary hover:text-white transition-all uppercase tracking-widest">
                          START INQUIRY
                        </button>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center border border-border hover:bg-muted/30 transition-colors disabled:opacity-30"
                    >
                      <span>‹</span>
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center text-xs font-mono ${
                            page === pageNum ? 'bg-foreground text-white' : 'border border-border hover:bg-muted/30 transition-colors'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="px-2 text-xs">...</span>
                        <button
                          onClick={() => setPage(totalPages)}
                          className="w-10 h-10 flex items-center justify-center border border-border text-xs font-mono hover:bg-muted/30 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-10 h-10 flex items-center justify-center border border-border hover:bg-muted/30 transition-colors disabled:opacity-30"
                    >
                      <span>›</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
