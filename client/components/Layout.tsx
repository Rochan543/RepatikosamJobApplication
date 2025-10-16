import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Briefcase, Home, BookText, Shield, Mail } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/jobs", label: "Job Posts", icon: Briefcase },
  { to: "/terms", label: "Terms & Conditions", icon: BookText },
  { to: "/privacy", label: "Privacy Policy", icon: Shield },
  { to: "/contact", label: "Contact Us", icon: Mail },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-extrabold">R</div>
            <span className="font-bold text-lg tracking-tight">RepatiKosam</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:text-foreground hover:bg-secondary",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="md:hidden">
            <Link to="/jobs">
              <Button size="sm" variant="default">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/70">© 2025 RepatiKosam | Built by Rochan Dakoju</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-primary">Terms</Link>
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
