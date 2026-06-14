import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { FiShare2, FiChevronRight, FiPlus, FiCheck } from "react-icons/fi"
import { getFeaturedReviews } from "@/lib/api"
import type { Review } from "@/lib/types"
import { FALLBACK_IMAGE } from "@/lib/constants"
import { Reveal } from "@/components/ui/Reveal"

export default function CompareVehiclesPage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Review[]>([])
  const [highlight, setHighlight] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  useEffect(() => {
    getFeaturedReviews(1, 4)
      .then((res) => setVehicles(res.data.slice(0, 2)))
      .catch(console.error)
  }, [])

  const v1 = vehicles[0]
  const v2 = vehicles[1]

  const comparisonData = v1 && v2 ? {
    powertrain: [
      { label: "MSRP", v1: v1.specs?.price ? `$${v1.specs.price.toLocaleString()}` : "—", v2: v2.specs?.price ? `$${v2.specs.price.toLocaleString()}` : "—" },
      { label: "ENGINE", v1: v1.specs?.engine || "—", v2: v2.specs?.engine || "—" },
      { label: "HORSEPOWER", v1: v1.specs?.horsepower ? `${v1.specs.horsepower} hp` : "—", v2: v2.specs?.horsepower ? `${v2.specs.horsepower} hp` : "—" },
      { label: "TORQUE", v1: v1.specs?.torque ? `${v1.specs.torque} lb-ft` : "—", v2: v2.specs?.torque ? `${v2.specs.torque} lb-ft` : "—" },
    ],
    efficiency: [
      { label: "FUEL ECONOMY", v1: v1.specs?.fuel_economy || "—", v2: v2.specs?.fuel_economy || "—" },
      { label: "DRIVETRAIN", v1: v1.specs?.drivetrain || "—", v2: v2.specs?.drivetrain || "—" },
    ],
    tech: [
      { label: "TRANSMISSION", v1: v1.specs?.transmission || "—", v2: v2.specs?.transmission || "—" },
      { label: "FUEL TYPE", v1: v1.specs?.fuel_type || "—", v2: v2.specs?.fuel_type || "—" },
      { label: "SEATING", v1: v1.specs?.seating ? `${v1.specs.seating} passengers` : "—", v2: v2.specs?.seating ? `${v2.specs.seating} passengers` : "—" },
    ],
    warranty: [
      { label: "TOP SPEED", v1: v1.specs?.top_speed || "—", v2: v2.specs?.top_speed || "—" },
      { label: "0-60 MPH", v1: v1.specs?.acceleration || "—", v2: v2.specs?.acceleration || "—" },
    ]
  } : null

  const isDiff = (v1: string, v2: string) => v1 !== v2 && v1 !== "—" && v2 !== "—"

  return (
    <div className="min-h-screen bg-background text-on-surface font-inter selection:bg-primary selection:text-white">
      <Header />
      <main className="max-w-[1280px] mx-auto px-6 md:px-12 py-8">
        {/* Breadcrumbs & Title */}
        <Reveal animation="fade-down" duration={500}>
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
                <Link className="hover:text-primary transition-colors" to="/">Home</Link>
                <FiChevronRight className="text-[10px]" />
                <span>Compare</span>
              </nav>
              <h1 className="text-5xl md:text-7xl font-archivo font-extrabold leading-none tracking-tight">
                VEHICLE <span className="text-primary">COMPARISON</span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-muted/30 px-4 py-2">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Highlight Differences</span>
                <div
                  className={`relative inline-block w-10 h-6 rounded-full cursor-pointer transition-colors ${highlight ? 'bg-primary' : 'bg-slate-300'}`}
                  onClick={() => setHighlight(!highlight)}
                >
                  <div className={`absolute top-0 w-6 h-6 bg-white rounded-full border-2 transition-transform duration-200 ${highlight ? 'left-4 border-primary' : 'left-0 border-slate-300'}`} />
                </div>
              </div>
              <button
                className="bg-secondary text-white px-6 py-2 text-xs font-mono hover:opacity-90 transition-all flex items-center gap-2"
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!") }}
              >
                <FiShare2 className="text-sm" /> SHARE
              </button>
            </div>
          </div>
        </Reveal>

        {/* Sticky Vehicle Header */}
        <Reveal animation="fade-up" delay={100}>
          <div className="grid grid-cols-5 gap-6 sticky top-20 z-40 bg-background pt-4 pb-4 border-b border-border">
            <div className="col-span-1 flex items-end pb-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-tight">Specifications</span>
            </div>

            {v1 && (
              <div className="relative group">
                <Link to={`/cars/${v1.slug}`}>
                  <div className="aspect-[16/10] bg-muted/30 overflow-hidden mb-3 border border-border">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={v1.featured_image || FALLBACK_IMAGE}
                      alt={v1.title} />
                  </div>
                </Link>
                <div className="text-2xl font-archivo font-bold uppercase truncate">{v1.manufacturer}</div>
                <div className="text-xs font-mono text-primary">{v1.year} MODEL</div>
              </div>
            )}

            {v2 && (
              <div className="relative group">
                <Link to={`/cars/${v2.slug}`}>
                  <div className="aspect-[16/10] bg-muted/30 overflow-hidden mb-3 border border-border">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={v2.featured_image || FALLBACK_IMAGE}
                      alt={v2.title} />
                  </div>
                </Link>
                <div className="text-2xl font-archivo font-bold uppercase truncate">{v2.manufacturer}</div>
                <div className="text-xs font-mono text-primary">{v2.year} MODEL</div>
              </div>
            )}

            {[0, 1].map((i) => (
              <div
                key={i}
                className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => navigate('/cars')}
              >
                <FiPlus className="text-4xl text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                <span className="text-xs font-mono text-muted-foreground">ADD VEHICLE</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Performance Benchmarks */}
        {v1 && v2 && (
          <>
            <Reveal animation="fade-up" delay={200}>
              <section className="py-8 border-b border-border">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl font-archivo font-bold uppercase">Performance Benchmarks</h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-5 gap-6">
                  <div className="col-span-1 py-4">
                    <div className="mb-8">
                      <span className="text-xs font-mono text-muted-foreground uppercase">0-60 MPH (SEC)</span>
                      <p className="text-[10px] font-mono text-muted-foreground/60">Lower is better</p>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-muted-foreground uppercase">TOP SPEED (MPH)</span>
                      <p className="text-[10px] font-mono text-muted-foreground/60">Higher is better</p>
                    </div>
                  </div>
                  <PerformanceColumn
                    acceleration={v1.specs?.acceleration}
                    topSpeed={v1.specs?.top_speed}
                  />
                  <PerformanceColumn
                    acceleration={v2.specs?.acceleration}
                    topSpeed={v2.specs?.top_speed}
                  />
                  <div className="col-span-2 flex items-center justify-center opacity-20">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest italic">Data Pending Selection</span>
                  </div>
                </div>
              </section>
            </Reveal>

            {/* Comparison Table */}
            <div className="mt-8 transition-all duration-300">
              {Object.entries(comparisonData!).map(([sectionKey, rows], sIdx) => (
                <Reveal key={sectionKey} animation="fade-up" delay={300 + sIdx * 50}>
                  <div className="mb-8">
                    <div className="bg-foreground text-white py-2 px-4 mb-2">
                      <span className="text-xs font-mono text-white uppercase tracking-[0.2em]">
                        {sectionKey.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                      </span>
                    </div>
                    {rows.map((row) => {
                      const diff = highlight && isDiff(row.v1, row.v2)
                      return (
                        <div key={row.label} className={`grid grid-cols-5 gap-6 border-b border-border py-4 hover:bg-muted/10 transition-colors ${diff ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
                          <div className="text-xs font-mono text-muted-foreground">{row.label}</div>
                          <div className={`text-sm font-bold ${diff ? 'text-primary' : ''}`}>{row.v1}</div>
                          <div className={`text-sm font-bold ${diff ? 'text-primary' : 'text-primary'}`}>{row.v2}</div>
                          <div className="col-span-2 text-muted-foreground/40 text-sm">—</div>
                        </div>
                      )
                    })}
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {!v1 && !v2 && (
          <div className="py-24 text-center text-muted-foreground">
            <p className="text-sm font-mono uppercase tracking-widest">Select vehicles to compare</p>
            <Link to="/cars" className="inline-block mt-6 text-primary text-xs font-mono hover:underline">
              Browse Inventory
            </Link>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-12 border-t-2 border-primary pt-8 flex justify-between items-center">
          <Link to="/cars" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-mono">
            <span>←</span> BACK TO LISTINGS
          </Link>
          <div className="flex gap-6">
            {savedMsg ? (
              <span className="flex items-center gap-2 px-8 py-3 text-xs font-mono text-green-600"><FiCheck /> Comparison Saved</span>
            ) : (
              <button
                onClick={() => {
                  localStorage.setItem("fa_comparison", JSON.stringify(vehicles.map(v => ({ id: v.id, slug: v.slug, manufacturer: v.manufacturer, model: v.model }))))
                  setSavedMsg(true)
                  setTimeout(() => setSavedMsg(false), 3000)
                }}
                className="px-8 py-3 bg-muted/30 text-foreground text-xs font-mono hover:bg-muted/50 transition-colors uppercase"
              >
                Save Comparison
              </button>
            )}
            <button
              onClick={() => navigate('/cars')}
              className="px-8 py-3 bg-primary text-white text-xs font-mono hover:opacity-90 transition-all uppercase shadow-lg shadow-primary/20"
            >
              Check Inventory
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function PerformanceColumn({ acceleration, topSpeed }: { acceleration?: string | null; topSpeed?: string | null }) {
  const accelVal = acceleration ? parseFloat(acceleration) : null
  const speedVal = topSpeed ? parseInt(topSpeed) : null
  const accelWidth = accelVal ? Math.max(10, Math.min(100, ((5 - accelVal) / 4) * 100)) : 0
  const speedWidth = speedVal ? Math.max(10, Math.min(100, (speedVal / 250) * 100)) : 0

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <div className="text-4xl font-archivo font-extrabold text-primary leading-none">{acceleration || "—"}</div>
        <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${accelWidth}%` }} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-4xl font-archivo font-extrabold text-foreground leading-none">{topSpeed || "—"}</div>
        <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className={`h-full bg-secondary rounded-full`} style={{ width: `${speedWidth}%` }} />
        </div>
      </div>
    </div>
  )
}
