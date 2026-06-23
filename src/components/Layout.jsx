import { Outlet, Link, useLocation } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Meet Them" },
  { to: "/dashboard", label: "My Bonds" },
  { to: "/donate", label: "Donate" },
  { to: "/about", label: "Our Mission" },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className="w-5 h-5 text-accent fill-accent group-hover:scale-110 transition-transform" />
            <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
              SoulBond
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  location.pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-lg border-b border-border md:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-base font-medium py-2 ${
                    location.pathname === link.to
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-accent fill-accent" />
                <span className="font-heading text-lg font-semibold">SoulBond</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Every life deserves a chance. Your virtual adoption creates a lifeline 
                that keeps animals safe, cared for, and on the path to forever homes.
              </p>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold mb-4 text-foreground">Navigate</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold mb-4 text-foreground">Contact the Shelter</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Have questions about visiting or physically adopting?<br />
                Reach out to our partner shelter directly.
              </p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} SoulBond. All proceeds go directly to our partner animal shelter.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}