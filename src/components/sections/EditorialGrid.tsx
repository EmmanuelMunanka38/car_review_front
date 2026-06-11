import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"
import type { Review } from "@/lib/types"
import { FALLBACK_IMAGE } from "@/lib/constants"

interface EditorialGridProps {
  reviews: Review[]
}

export function EditorialGrid({ reviews }: EditorialGridProps) {
  const editorials = reviews.slice(0, 4)

  return (
    <section className="py-24 bg-background border-y border-border">
      <div className="px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-sm font-mono text-primary block mb-2 uppercase tracking-widest">Deep Dives</span>
            <h2 className="text-4xl md:text-5xl font-archivo font-extrabold uppercase">LATEST EDITORIALS</h2>
          </div>
          <Link className="text-sm font-mono text-foreground border-b-2 border-primary pb-1 group flex items-center gap-2 uppercase tracking-widest font-bold" to="/cars">
            VIEW ALL REVIEWS <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {editorials.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm font-mono uppercase tracking-widest">No editorials published yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {editorials.map((article) => (
              <Link key={article.id} to={`/cars/${article.slug}`} className="flex flex-col group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden mb-6 relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={article.featured_image || FALLBACK_IMAGE}
                    alt={article.title}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-widest">
                  {article.manufacturer} {article.model}
                </span>
                <h3 className="text-2xl font-archivo font-bold leading-tight mb-6 group-hover:text-primary transition-colors uppercase">
                  {article.title}
                </h3>
                <div className="mt-auto flex items-center gap-3 pt-6 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary uppercase">
                    {article.manufacturer?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none uppercase">{article.manufacturer}</p>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1">{article.year} · {article.model}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
