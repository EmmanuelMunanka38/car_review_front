import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import type { Review } from "@/lib/types"

interface HeroProps {
  reviews: Review[]
}

export function Hero({ reviews }: HeroProps) {
  const featured = reviews.find((r) => r.featured) || reviews[0]

  if (!featured) {
    return (
      <section className="relative h-[800px] w-full overflow-hidden flex items-end bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://assets.mixkit.co/videos/52014/52014-1080.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 w-full px-6 md:px-12 max-w-[1280px] mx-auto pb-16">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-archivo font-extrabold text-white mb-6 leading-[0.9] tracking-tighter uppercase">
              THE FUTURE OF <br /> AUTOMOTIVE 
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-lg mb-8 font-inter">
              Premium automotive journalism and technical precision.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[800px] w-full overflow-hidden flex items-end">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <iframe
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%]"
          src="https://www.youtube.com/embed/4nfq18MG7Mo?autoplay=1&mute=1&loop=1&playlist=4nfq18MG7Mo&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0"
          allow="autoplay; encrypted-media"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="relative z-10 w-full px-6 md:px-12 max-w-[1280px] mx-auto pb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary text-white px-3 py-1 text-xs font-mono uppercase">Review</span>
            <span className="text-white/80 text-xs font-mono uppercase tracking-widest">{featured.year} MODEL YEAR</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-archivo font-extrabold text-white mb-6 leading-[0.9] tracking-tighter uppercase">
            {featured.title || `${featured.manufacturer} ${featured.model}`}
          </h1>
          {featured.excerpt && (
            <p className="text-lg md:text-xl text-white/80 max-w-lg mb-8 font-inter">
              {featured.excerpt}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link to={`/cars/${featured.slug}`}>
              <Button className="px-8 py-6 text-sm font-mono uppercase">READ REVIEW</Button>
            </Link>
            <Link to={`/cars/${featured.slug}`}>
              <Button variant="outline" className="px-8 py-6 text-sm font-mono uppercase border-white text-white hover:bg-white hover:text-black">
                BUILD & PRICE
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-8 border-l border-white/20 pl-8 text-white">
          {featured.specs?.acceleration && (
            <div>
              <span className="text-xs font-mono text-white/60 block uppercase mb-1">0-60 MPH</span>
              <span className="text-4xl font-archivo font-bold">{featured.specs.acceleration}</span>
            </div>
          )}
          {featured.specs?.top_speed && (
            <div>
              <span className="text-xs font-mono text-white/60 block uppercase mb-1">TOP SPEED</span>
              <span className="text-4xl font-archivo font-bold">{featured.specs.top_speed}</span>
            </div>
          )}
          {featured.specs?.horsepower && (
            <div>
              <span className="text-xs font-mono text-white/60 block uppercase mb-1">HORSEPOWER</span>
              <span className="text-4xl font-archivo font-bold">{featured.specs.horsepower}HP</span>
            </div>
          )}
          {featured.specs?.price && (
            <div>
              <span className="text-xs font-mono text-white/60 block uppercase mb-1">MSRP FROM</span>
              <span className="text-4xl font-archivo font-bold">${(featured.specs.price / 1000).toFixed(0)}k</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
