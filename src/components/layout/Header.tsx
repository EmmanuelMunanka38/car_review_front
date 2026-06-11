import { Link, useLocation } from "react-router-dom"
import { FiSearch, FiUser } from "react-icons/fi"
import { MdMenu } from "react-icons/md"
import { Button } from "@/components/ui/Button"

const navLinks = [
  { label: "Cars", path: "/cars" },
  { label: "Reviews", path: "/" },
  { label: "News", path: "/" },
  { label: "Compare", path: "/compare" },
]

export function Header() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <nav className="flex justify-between items-center w-full px-6 md:px-12 max-w-[1280px] mx-auto h-20">
        <div className="flex items-center gap-12">
          <Link
            className="text-2xl font-archivo font-extrabold tracking-tighter text-foreground"
            to="/"
          >
            FUTURE AUTOMOTIVE
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className={`text-sm font-mono transition-all ${
                  isActive(link.path)
                    ? "text-primary border-b-2 border-primary pb-1 font-bold"
                    : "text-foreground/80 hover:text-primary hover:border-b-2 hover:border-primary/50 pb-1"
                }`}
                to={link.path}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-muted/50 px-4 py-2 rounded-full border border-border/50">
            <FiSearch className="text-muted-foreground" />
            <input
              className="bg-transparent border-none focus:ring-0 text-xs placeholder-muted-foreground/50 w-48 ml-2 outline-none"
              placeholder="Search vehicles..."
              type="text"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <FiUser className="text-xl" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MdMenu className="text-2xl" />
          </Button>
        </div>
      </nav>
    </header>
  )
}
