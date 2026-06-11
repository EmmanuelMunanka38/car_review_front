import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import type { Review } from "@/lib/types"
import { FALLBACK_IMAGE } from "@/lib/constants"

interface TrendingCarsProps {
  reviews: Review[]
}

export function TrendingCars({ reviews }: TrendingCarsProps) {
  const trending = reviews.filter((r) => r.featured).slice(0, 6)
  const display = trending.length > 0 ? trending : reviews.slice(0, 6)

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="px-6 md:px-12 max-w-[1280px] mx-auto mb-12 flex justify-between items-end">
        <div>
          <span className="text-sm font-mono text-primary block mb-2 uppercase tracking-widest">Market Intelligence</span>
          <h2 className="text-4xl md:text-5xl font-archivo font-extrabold text-foreground uppercase tracking-tight">TRENDING NOW</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full border-border">
            <FiChevronLeft className="text-xl" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full border-border">
            <FiChevronRight className="text-xl" />
          </Button>
        </div>
      </div>
      {display.length === 0 ? (
        <div className="px-6 md:px-12">
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm font-mono uppercase tracking-widest">No vehicles available yet</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-8 hide-scrollbar snap-x">
          {display.map((car, i) => (
            <Link
              key={car.id}
              to={`/cars/${car.slug}`}
              className="min-w-[320px] md:min-w-[420px] snap-start bg-card border border-border hover:border-primary group transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={car.featured_image || FALLBACK_IMAGE}
                  alt={car.title}
                />
                <div className="absolute top-4 left-4 bg-foreground text-background px-3 py-1 text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-archivo font-bold leading-none uppercase">
                    {car.manufacturer} {car.model}
                  </h3>
                  {car.specs?.price && (
                    <span className="text-sm font-mono text-primary font-bold">
                      ${car.specs.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block mb-1">HP</span>
                    <span className="text-sm font-mono font-bold">{car.specs?.horsepower ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block mb-1">TO 60</span>
                    <span className="text-sm font-mono font-bold">{car.specs?.acceleration ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block mb-1">TOP</span>
                    <span className="text-sm font-mono font-bold">{car.specs?.top_speed ?? "—"}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
