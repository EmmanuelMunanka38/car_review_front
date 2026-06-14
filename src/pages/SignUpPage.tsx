import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useAuth } from "@/lib/auth"

export default function SignUpPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await register(email, password, name || undefined)
      navigate("/admin")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background font-inter selection:bg-primary selection:text-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="border border-border p-10">
            <h1 className="text-3xl font-archivo font-extrabold uppercase tracking-tighter mb-2">
              SIGN <span className="text-primary">UP</span>
            </h1>
            <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs mb-10">
              CREATE YOUR ACCOUNT
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500 font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-inter"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-inter"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors font-inter"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-mono font-bold uppercase tracking-widest text-xs py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground font-mono">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
