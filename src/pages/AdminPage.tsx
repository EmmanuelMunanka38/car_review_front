import { useState, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { createReview, getReviews, deleteReview } from "@/lib/api"
import type { Review, ReviewInput } from "@/lib/types"
import { 
  FiGrid, FiBox, FiUsers, FiSettings, 
  FiPlus, FiTrash2, FiEdit, FiSearch, FiActivity, FiTag,
  FiZap, FiCheck, FiX as FiXIcon, FiArrowUpRight
} from "react-icons/fi"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts'
import { Reveal } from "@/components/ui/Reveal"

type AdminModule = "overview" | "inventory" | "add" | "brands" | "users"

export default function AdminPage() {
  const [activeModule, setActiveModule] = useState<AdminModule>("overview")
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState<ReviewInput>({
    title: "",
    manufacturer: "",
    model: "",
    year: new Date().getFullYear(),
    excerpt: "",
    content: "",
    rating: 5,
    status: "published",
    featured: false,
    featured_image: "",
    specs: {
      engine: "",
      horsepower: 0,
      top_speed: "",
      acceleration: "",
      price: 0,
      fuel_type: "Electric",
    },
    gallery: [{ image_url: "", alt_text: "" }],
  })

  // Mock Data
  const trafficData = [
    { name: 'Mon', views: 400 }, { name: 'Tue', views: 900 },
    { name: 'Wed', views: 600 }, { name: 'Thu', views: 1200 },
    { name: 'Fri', views: 800 }, { name: 'Sat', views: 1600 },
    { name: 'Sun', views: 1100 },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getReviews({ limit: 100 })
      setReviews(res.data)
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return
    try {
      await deleteReview(id)
      setReviews(prev => prev.filter(r => r.id !== id))
      setSuccess("Vehicle removed successfully")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError("Failed to delete vehicle")
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (name.startsWith("specs.")) {
      const specField = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        specs: { ...prev.specs, [specField]: type === "number" ? parseFloat(value) : value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) : (type === "checkbox" ? (e.target as HTMLInputElement).checked : value)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createReview(formData)
      setSuccess("New vehicle published successfully")
      setActiveModule("inventory")
      fetchData()
    } catch (err: any) {
      setError("Publication error. Please check your data.")
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = reviews.filter(r => 
    r.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.model.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-inter">
      <Header />
      
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* SIDEBAR: PROFESSIONAL SaaS STYLE */}
        <aside className="w-full lg:w-72 border-r border-slate-200 bg-white flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary flex items-center justify-center text-white rounded-lg shadow-lg shadow-primary/20">
                <FiActivity size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight">Admin Portal</h2>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Future Automotive</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <SidebarItem icon={FiGrid} label="Dashboard" active={activeModule === 'overview'} onClick={() => setActiveModule('overview')} />
            <SidebarItem icon={FiBox} label="Vehicle Fleet" active={activeModule === 'inventory'} onClick={() => setActiveModule('inventory')} />
            <SidebarItem icon={FiPlus} label="Add New Vehicle" active={activeModule === 'add'} onClick={() => setActiveModule('add')} />
            <div className="py-2 my-2 border-t border-slate-100" />
            <SidebarItem icon={FiTag} label="Brands" active={activeModule === 'brands'} onClick={() => setActiveModule('brands')} />
            <SidebarItem icon={FiUsers} label="User Access" active={activeModule === 'users'} onClick={() => setActiveModule('users')} />
            <SidebarItem icon={FiSettings} label="Settings" active={false} onClick={() => {}} />
          </nav>

          <div className="p-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 flex items-center gap-3 rounded-xl">
              <div className="w-8 h-8 bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs rounded-full">AR</div>
              <div>
                <p className="text-xs font-bold leading-none">Alex Rivera</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Super Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT DISPLAY */}
        <main className="flex-1 overflow-y-auto">
          {success && (
            <div className="m-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm flex items-center justify-between rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <FiCheck className="text-green-500" />
                <span className="font-medium">{success}</span>
              </div>
              <button onClick={() => setSuccess(null)}><FiXIcon size={14} /></button>
            </div>
          )}
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm flex items-center justify-between rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <FiXIcon className="text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
              <button onClick={() => setError(null)}><FiXIcon size={14} /></button>
            </div>
          )}

          {activeModule === 'overview' && (
            <div className="p-8 md:p-12 space-y-10 max-w-[1400px] mx-auto">
              <Reveal animation="fade-down" duration={400}>
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-archivo font-black uppercase tracking-tight text-slate-900">Dashboard <span className="text-primary italic">Overview</span></h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Real-time performance and inventory metrics.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated: Just now</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  </div>
                </header>
              </Reveal>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Reveal animation="fade-up" delay={100}>
                  <ProfessionalStatCard label="Total Inventory" value={reviews.length} icon={FiBox} trend="+4.2%" />
                </Reveal>
                <Reveal animation="fade-up" delay={150}>
                  <ProfessionalStatCard label="Monthly Views" value="128.4K" icon={FiZap} trend="+12.8%" />
                </Reveal>
                <Reveal animation="fade-up" delay={200}>
                  <ProfessionalStatCard label="Avg. Rating" value="4.8" icon={FiActivity} trend="+0.2" />
                </Reveal>
                <Reveal animation="fade-up" delay={250}>
                  <ProfessionalStatCard label="Live Users" value="1,402" icon={FiUsers} trend="+18%" />
                </Reveal>
              </div>

              {/* ANALYTICS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Reveal animation="fade-right" delay={300} className="lg:col-span-2">
                  <div className="bg-white border border-slate-200 p-8 h-full rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" /> Traffic Analytics
                      </h3>
                      <select className="bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest px-4 py-2 outline-none rounded-lg">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                      </select>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficData}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E31837" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#E31837" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }}
                            itemStyle={{ color: '#E31837', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="views" stroke="#E31837" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Reveal>

                <Reveal animation="fade-left" delay={400}>
                  <div className="bg-slate-900 text-white p-8 flex flex-col justify-between h-full rounded-2xl shadow-xl">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-10">System Status</h3>
                      <div className="space-y-8">
                        <ProfessionalHealthMetric label="API Gateway" value="Optimal" progress={98} />
                        <ProfessionalHealthMetric label="Database Load" value="Normal" progress={24} />
                        <ProfessionalHealthMetric label="Media Assets" value="Stable" progress={100} />
                      </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-800">
                      <p className="text-[10px] text-slate-500 font-mono uppercase leading-relaxed">
                        All systems are operating within normal parameters. Next scheduled maintenance: June 24, 02:00 AM.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          )}

          {activeModule === 'inventory' && (
            <div className="p-8 md:p-12 space-y-8 max-w-[1400px] mx-auto">
              <Reveal animation="fade-down">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-archivo font-black uppercase tracking-tight text-slate-900">Vehicle <span className="text-primary italic">Fleet</span></h1>
                    <p className="text-slate-500 text-sm font-medium">Manage and monitor all vehicle listings.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search fleet..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-slate-200 px-12 py-3 text-sm rounded-xl focus:ring-2 ring-primary/10 outline-none w-72"
                      />
                    </div>
                    <Button onClick={() => setActiveModule('add')} className="bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl">
                      Add Vehicle
                    </Button>
                  </div>
                </header>
              </Reveal>

              <Reveal animation="fade-up" delay={200}>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200">
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Vehicle Details</th>
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Spec Configuration</th>
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Visibility</th>
                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredReviews.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-10 overflow-hidden border border-slate-200 rounded-lg group-hover:scale-105 transition-transform shadow-sm">
                                <img src={r.featured_image || ''} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{r.manufacturer} {r.model}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{r.year} Model Edition</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-slate-700">{r.specs?.engine || 'BEV System'}</span>
                              <span className="text-[10px] font-medium text-slate-400">{r.specs?.horsepower} HP • {r.specs?.fuel_type}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                              r.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                              {r.status}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"><FiEdit size={16} /></button>
                              <button onClick={() => handleDelete(r.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-all"><FiTrash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          )}

          {activeModule === 'add' && (
            <div className="p-8 md:p-12 max-w-[1000px] mx-auto">
              <Reveal animation="fade-down">
                <header className="mb-12">
                  <h1 className="text-3xl font-archivo font-black uppercase tracking-tight text-slate-900">New Vehicle <span className="text-primary italic">Entry</span></h1>
                  <p className="text-slate-500 text-sm font-medium mt-1">Populate all technical specifications and media assets.</p>
                </header>
              </Reveal>

              <Reveal animation="fade-up" delay={200}>
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 md:p-12 space-y-12 shadow-sm rounded-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <ProfessionalInput label="Manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleFormChange} placeholder="e.g., Porsche" />
                    <ProfessionalInput label="Model Name" name="model" value={formData.model} onChange={handleFormChange} placeholder="e.g., Taycan GT" />
                    <ProfessionalInput label="Display Title" name="title" value={formData.title} onChange={handleFormChange} placeholder="e.g., 2024 Porsche Taycan Review" />
                    <ProfessionalInput label="Model Year" name="year" type="number" value={formData.year} onChange={handleFormChange} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deep-Dive Content</label>
                    <textarea 
                      name="content" 
                      value={formData.content} 
                      onChange={handleFormChange} 
                      rows={8} 
                      className="w-full bg-slate-50 border-none p-6 text-sm font-medium rounded-2xl focus:ring-2 ring-primary/10 outline-none placeholder:text-slate-300"
                      placeholder="Enter detailed review and technical analysis..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                    <ProfessionalInput label="Horsepower" name="specs.horsepower" type="number" value={formData.specs.horsepower} onChange={handleFormChange} />
                    <ProfessionalInput label="Top Speed" name="specs.top_speed" value={formData.specs.top_speed} onChange={handleFormChange} />
                    <ProfessionalInput label="Base MSRP ($)" name="specs.price" type="number" value={formData.specs.price} onChange={handleFormChange} />
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <ProfessionalInput label="Featured Image URL" name="featured_image" value={formData.featured_image} onChange={handleFormChange} placeholder="https://images.unsplash.com/..." />
                  </div>
                  
                  <div className="pt-10">
                    <Button disabled={loading} className="w-full bg-slate-900 hover:bg-primary text-white py-8 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-2xl shadow-xl">
                      {loading ? "Processing Data..." : "Publish Vehicle Entry"}
                    </Button>
                  </div>
                </form>
              </Reveal>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-5 py-3.5 transition-all duration-200 group rounded-xl ${
        active 
          ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={18} className={active ? 'text-primary scale-110' : 'group-hover:text-primary transition-colors'} />
      <span className={`text-[11px] font-bold uppercase tracking-wider ${active ? '' : ''}`}>{label}</span>
    </button>
  )
}

function ProfessionalStatCard({ label, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-white border border-slate-200 p-7 transition-all group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
          <p className="text-3xl font-archivo font-black tracking-tight text-slate-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-bold text-green-500">{trend}</span>
              <FiArrowUpRight size={12} className="text-green-500" />
            </div>
          )}
        </div>
        <div className="p-3 bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all rounded-xl">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

function ProfessionalHealthMetric({ label, value, progress }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-xs font-bold text-primary">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-800 overflow-hidden rounded-full">
        <div 
          className="h-full bg-primary transition-all duration-1000" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  )
}

function ProfessionalInput({ label, name, value, onChange, type = "text", placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 ring-primary/10 outline-none placeholder:text-slate-300" 
      />
    </div>
  )
}
