import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { FiShare2, FiHeart, FiX, FiCheck } from "react-icons/fi"
import { getReviewBySlug, getReviews } from "@/lib/api"
import type { Review } from "@/lib/types"
import { FALLBACK_IMAGE, FALLBACK_IMAGE_LG } from "@/lib/constants"
import { Reveal } from "@/components/ui/Reveal"

export default function CarDetailsPage() {
  const { id: slug } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [review, setReview] = useState<Review | null>(null)
  const [related, setRelated] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [testDriveMsg, setTestDriveMsg] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)

    getReviewBySlug(slug)
      .then((res) => {
        setReview(res.data)
        return getReviews({ manufacturer: res.data.manufacturer, limit: 4 })
      })
      .then((res) => {
        setRelated(res.data.filter((r) => r.slug !== slug).slice(0, 4))
      })
      .catch((err) => {
        console.error("API Error in CarDetailsPage:", err)
        setError("Could not load vehicle details.")
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-inter">
        <Header />
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-24 text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted/50 rounded w-1/3 mx-auto" />
            <div className="h-64 bg-muted/30 rounded" />
            <div className="h-4 bg-muted/30 rounded w-2/3 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-background font-inter">
        <Header />
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-24 text-center">
          <h2 className="text-3xl font-archivo font-bold mb-4 uppercase">Review Not Found</h2>
          <p className="text-muted-foreground mb-8">{error || "The review you're looking for doesn't exist."}</p>
          <Link to="/"><Button>BACK TO HOME</Button></Link>
        </div>
        <Footer />
      </div>
    )
  }

  const specs = review.specs
  const gallery = review.gallery || []
  const content = review.content as Record<string, unknown> | null

  return (
    <div className="min-h-screen bg-background text-on-surface font-inter selection:bg-primary selection:text-white">
      <Header />
      <main className="max-w-[1280px] mx-auto px-6 md:px-12 py-8">
        {/* Breadcrumbs & Actions */}
        <Reveal animation="fade-down" duration={400}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Link to="/cars" className="hover:text-primary">CARS</Link> / <span className="text-foreground font-bold uppercase">{review.manufacturer}</span>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-border text-xs font-mono hover:bg-muted/30 transition-all"
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!") }}
              >
                <FiShare2 className="text-sm" /> SHARE
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 border text-xs font-mono transition-all ${isSaved ? 'border-primary text-primary' : 'border-border hover:bg-muted/30'}`}
                onClick={() => setIsSaved(!isSaved)}
              >
                <FiHeart className={`text-sm ${isSaved ? 'fill-current' : ''}`} /> {isSaved ? 'SAVED' : 'SAVE'}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Vehicle Header */}
        <Reveal animation="fade-up" delay={100}>
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-archivo font-extrabold leading-none uppercase tracking-tight">
                {review.year} {review.manufacturer} {review.model}
              </h1>
              <div className="flex items-center gap-6 mt-3">
                <span className="px-4 py-1.5 bg-foreground text-background text-xs font-mono tracking-widest uppercase">{review.model}</span>
                {review.rating && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-primary text-lg">★</span>
                    <span className="text-xs font-mono font-bold">{review.rating.toFixed(1)} / 10 EDITOR SCORE</span>
                  </div>
                )}
              </div>
            </div>
            {specs?.price && (
              <div className="text-right">
                <p className="text-xs font-mono text-muted-foreground">MSRP STARTING AT</p>
                <p className="text-4xl md:text-5xl font-archivo font-extrabold text-primary">
                  ${specs.price.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Gallery + Config Sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-24">
          <div className="lg:col-span-3">
            <Reveal animation="zoom-in" delay={200}>
              <div className="aspect-[21/9] overflow-hidden bg-muted/30 relative group">
                <img
                  className="w-full h-full object-cover"
                  src={review.featured_image || FALLBACK_IMAGE_LG}
                  alt={review.title}
                />
                <button
                  className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/70 backdrop-blur-md px-6 py-3 border border-white/20 rounded-full text-xs font-mono hover:bg-white transition-all"
                  onClick={() => setLightboxUrl(review.featured_image || FALLBACK_IMAGE_LG)}
                >
                  VIEW 360°
                </button>
                <button
                  className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-3 border border-white/20 rounded-full text-xs font-mono hover:bg-white transition-all"
                  onClick={() => setLightboxUrl(review.featured_image || FALLBACK_IMAGE_LG)}
                >
                  <span className="text-lg">⛶</span>
                </button>
              </div>
            </Reveal>
            {gallery.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {gallery.slice(0, 4).map((img, idx) => (
                  <Reveal key={img.id} animation="fade-up" delay={300 + idx * 50}>
                    <div className="aspect-video bg-muted/50 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setLightboxUrl(img.image_url)}>
                      <img className="w-full h-full object-cover" src={img.image_url} alt={img.alt_text || ""} />
                    </div>
                  </Reveal>
                ))}
                {gallery.length > 4 && (
                  <Reveal animation="fade-up" delay={500}>
                    <div className="aspect-video bg-muted/50 overflow-hidden cursor-pointer relative">
                      <img className="w-full h-full object-cover blur-[2px]" src={gallery[4].image_url} alt="" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-mono">
                        +{gallery.length - 4} MORE
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>
            )}
          </div>

          {/* Configuration Sidebar */}
          <Reveal animation="fade-left" delay={300} className="h-full">
            <div className="bg-muted/20 p-6 flex flex-col border border-border h-full">
              <h3 className="text-2xl font-archivo font-bold mb-6 uppercase">Configure</h3>
              <div className="space-y-6 flex-grow">
                <div>
                  <label className="text-xs font-mono text-muted-foreground block mb-2">EXTERIOR COLOR</label>
                  <div className="flex gap-2">
                    {['#1e2d4d', '#fcfcfc', '#1c1c1c', '#b90027', '#717171'].map((color, i) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border ${i === 0 ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground block mb-2">INTERIOR THEME</label>
                  <select className="w-full bg-background border-border text-xs font-mono p-3 focus:border-primary focus:ring-0 outline-none">
                    <option>Standard Leather</option>
                    <option>Premium Sport Seats</option>
                    <option>Carbon Fiber Package</option>
                  </select>
                </div>
                {specs?.price && (
                  <div className="pt-6 border-t border-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono text-muted-foreground">EST. MONTHLY</span>
                      <span className="text-sm font-mono font-bold">${(specs.price / 72).toFixed(0)}/mo</span>
                    </div>
                  </div>
                )}
              </div>
              <Button className="w-full py-4 text-sm font-mono mt-8" onClick={() => setTestDriveMsg(true)}>BOOK A TEST DRIVE</Button>
              <button className="w-full border border-border text-foreground py-4 text-sm font-mono mt-2 hover:bg-muted/30 transition-colors" onClick={() => navigate(`/cars?manufacturer=${review.manufacturer}`)}>LOCAL INVENTORY</button>
            </div>
          </Reveal>
        </section>

        {/* Performance Metrics & Specs */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24">
          <div className="lg:col-span-8 space-y-8">
            {/* Performance Gauges */}
            {specs && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {specs.acceleration && (
                  <Reveal animation="fade-up" delay={100}>
                    <div className="bg-muted/30 p-6 border border-border text-center">
                      <p className="text-xs font-mono text-muted-foreground mb-3">0-60 MPH</p>
                      <p className="text-4xl font-archivo font-extrabold text-primary leading-none">{specs.acceleration}</p>
                      <div className="w-full h-1 bg-border mt-4 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "90%" }} />
                      </div>
                      <p className="text-xs font-mono mt-2">CLASS LEADING</p>
                    </div>
                  </Reveal>
                )}
                {specs.horsepower && (
                  <Reveal animation="fade-up" delay={200}>
                    <div className="bg-muted/30 p-6 border border-border text-center">
                      <p className="text-xs font-mono text-muted-foreground mb-3">MAX OUTPUT</p>
                      <p className="text-4xl font-archivo font-extrabold text-primary leading-none">{specs.horsepower}HP</p>
                      <div className="w-full h-1 bg-border mt-4 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "90%" }} />
                      </div>
                      <p className="text-xs font-mono mt-2">PEAK POWER</p>
                    </div>
                  </Reveal>
                )}
                {specs.top_speed && (
                  <Reveal animation="fade-up" delay={300}>
                    <div className="bg-muted/30 p-6 border border-border text-center">
                      <p className="text-xs font-mono text-muted-foreground mb-3">TOP SPEED</p>
                      <p className="text-4xl font-archivo font-extrabold text-primary leading-none">{specs.top_speed}</p>
                      <div className="w-full h-1 bg-border mt-4 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "75%" }} />
                      </div>
                      <p className="text-xs font-mono mt-2">LIMITED</p>
                    </div>
                  </Reveal>
                )}
              </div>
            )}

            {/* Spec Tabs */}
            {specs && (
              <Reveal animation="fade-up">
                <div>
                  <div className="flex border-b border-border overflow-x-auto">
                    {["POWERTRAIN", "RANGE & CHARGING", "CHASSIS & BRAKES", "INTERIOR & TECH"].map((tab, i) => (
                      <button
                        key={tab}
                        className={`px-8 py-4 text-xs font-mono whitespace-nowrap ${i === 0 ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        { label: "Engine", value: specs.engine },
                        { label: "Horsepower", value: specs.horsepower ? `${specs.horsepower} hp` : null },
                        { label: "Torque", value: specs.torque ? `${specs.torque} lb-ft` : null },
                        { label: "Transmission", value: specs.transmission },
                        { label: "Drivetrain", value: specs.drivetrain },
                        { label: "Fuel Economy", value: specs.fuel_economy },
                        { label: "Fuel Type", value: specs.fuel_type },
                        { label: "Seating", value: specs.seating ? `${specs.seating} passengers` : null },
                      ].filter((s) => s.value).map((spec) => (
                        <div key={spec.label} className="pl-4 py-3 border-b border-border/30 border-l-2 border-l-transparent hover:border-l-primary transition-colors">
                          <span className="block text-xs font-mono text-muted-foreground uppercase">{spec.label}</span>
                          <span className="block text-base font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* Expert Review */}
            {review.rating != null && (
              <Reveal animation="fade-up">
                <div className="bg-foreground p-8 text-background">
                  <h3 className="text-2xl font-archivo font-bold mb-6 border-b border-white/20 w-fit pb-2 uppercase">Expert Editorial</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2">
                      {review.excerpt && (
                        <p className="text-lg italic mb-6 text-white/80 leading-relaxed">"{review.excerpt}"</p>
                      )}
                      {content && (
                        <div className="flex gap-8">
                          {(content.pros as string[])?.length > 0 && (
                            <div>
                              <h4 className="text-primary text-xs font-mono mb-2 uppercase tracking-widest">PROS</h4>
                              <ul className="text-xs font-mono space-y-1 opacity-80">
                                {(content.pros as string[]).map((p: string) => (
                                  <li key={p}>+ {p}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(content.cons as string[])?.length > 0 && (
                            <div>
                              <h4 className="text-muted-foreground text-xs font-mono mb-2 uppercase tracking-widest">CONS</h4>
                              <ul className="text-xs font-mono space-y-1 opacity-80">
                                {(content.cons as string[]).map((c: string) => (
                                  <li key={c}>- {c}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10">
                      <span className="text-xs font-mono text-white/60 uppercase mb-2">Overall Score</span>
                      <div className="text-6xl font-archivo font-extrabold text-primary leading-none">{review.rating.toFixed(1)}</div>
                      <div className="w-full space-y-2 mt-4">
                        {[
                          { label: "PERFORMANCE", score: Math.min(10, review.rating + 1).toFixed(1), width: `${Math.min(100, (review.rating + 1) * 10)}%` },
                          { label: "LUXURY", score: review.rating.toFixed(1), width: `${review.rating * 10}%` },
                          { label: "VALUE", score: Math.max(0, review.rating - 1.5).toFixed(1), width: `${Math.max(0, review.rating - 1.5) * 10}%` },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-[10px] font-mono"><span>{item.label}</span><span>{item.score}</span></div>
                            <div className="w-full h-1 bg-white/10"><div className="h-full bg-primary" style={{ width: item.width }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Comparison Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {related.length > 0 && (
              <Reveal animation="fade-left" delay={200}>
                <div className="border border-border p-6">
                  <h4 className="text-2xl font-archivo font-bold mb-6 border-b border-primary w-fit pb-1 uppercase">Compare With</h4>
                  <div className="space-y-4">
                    {related.slice(0, 3).map((v) => (
                      <Link key={v.id} to={`/cars/${v.slug}`} className="flex items-center gap-4 group cursor-pointer hover:bg-muted/20 p-2 transition-colors">
                        <div className="w-24 aspect-video bg-muted/30 overflow-hidden">
                          <img className="w-full h-full object-cover" src={v.featured_image || ""} alt={v.title} />
                        </div>
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">VS. {v.manufacturer}</p>
                          <p className="text-sm font-mono font-bold">{v.manufacturer} {v.model}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link to="/compare" className="block w-full mt-6 py-3 border border-foreground text-xs font-mono uppercase text-center hover:bg-foreground hover:text-white transition-all">
                    Launch Full Compare
                  </Link>
                </div>
              </Reveal>
            )}

            {review.rating && (
              <Reveal animation="fade-left" delay={400}>
                <div className="border border-border p-6 bg-muted/20">
                  <h4 className="text-2xl font-archivo font-bold mb-6 uppercase">Rating</h4>
                  <div className="text-center">
                    <div className="text-6xl font-archivo font-extrabold text-primary">{review.rating.toFixed(1)}</div>
                    <p className="text-xs font-mono text-muted-foreground mt-2">out of 10</p>
                    <div className="flex justify-center gap-1 mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-lg ${star <= Math.round((review.rating as number) / 2) ? 'text-primary' : 'text-muted-foreground'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-2">{review.views.toLocaleString()} views</p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* Related Vehicles */}
        {related.length > 0 && (
          <section className="mb-24">
            <Reveal animation="fade-right">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-4xl font-archivo font-extrabold uppercase tracking-tight">More from {review.manufacturer}</h3>
                <Link to={`/cars?manufacturer=${review.manufacturer}`} className="text-xs font-mono border-b-2 border-foreground pb-1">
                  VIEW ALL
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((car, idx) => (
                <Reveal key={car.id} animation="fade-up" delay={idx * 100}>
                  <Link to={`/cars/${car.slug}`} className="group border border-border hover:border-foreground transition-colors cursor-pointer bg-white block h-full">
                    <div className="aspect-video overflow-hidden">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={car.featured_image || FALLBACK_IMAGE}
                        alt={car.title} />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-2xl font-archivo font-bold uppercase leading-tight">{car.manufacturer} {car.model}</h4>
                        <span className="text-xs font-mono bg-muted/30 px-2 py-1">{car.year}</span>
                      </div>
                      {car.specs?.price && <p className="text-sm font-mono text-primary font-bold">${car.specs.price.toLocaleString()}</p>}
                      <div className="mt-4 flex gap-4 text-muted-foreground text-xs font-mono">
                        {car.specs?.acceleration && <span>{car.specs.acceleration} 0-60</span>}
                        {car.specs?.horsepower && <span>{car.specs.horsepower}HP</span>}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>

      {testDriveMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setTestDriveMsg(false)}>
          <div className="bg-background p-10 text-center max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <FiCheck className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-archivo font-bold mb-2 uppercase">Test Drive Booked</h3>
            <p className="text-sm text-muted-foreground mb-6">A representative will contact you within 24 hours to confirm your appointment.</p>
            <Button onClick={() => setTestDriveMsg(false)}>Got it</Button>
          </div>
        </div>
      )}

      {lightboxUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxUrl(null)}>
          <button className="absolute top-6 right-6 text-white text-2xl z-10" onClick={() => setLightboxUrl(null)}>
            <FiX />
          </button>
          <img className="max-w-[90vw] max-h-[90vh] object-contain" src={lightboxUrl} alt="" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <Footer />
    </div>
  )
}
