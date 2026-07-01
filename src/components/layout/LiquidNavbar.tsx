import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SeraLogo } from "@/components/ui/sera-logo"
import { TextRoll } from "@/components/ui/text-roll"
import { cn } from "@/lib/utils"

export interface NavItem {
  name: string
  href: string
  isRouterLink?: boolean
}

interface LiquidNavbarProps {
  items: NavItem[]
  showProgress?: boolean
}

export function LiquidNavbar({ items, showProgress = false }: LiquidNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const [activeTab, setActiveTab] = useState("")

  const { scrollYProgress } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const currentItem = items.find((item) => {
      if (item.href.startsWith("#")) return item.href === hash
      // Exact match for root, otherwise prefix match on pathname segment
      if (item.href === "/") return pathname === "/"
      return pathname === item.href || pathname.startsWith(item.href + "/")
    })
    setActiveTab(currentItem ? currentItem.name : "")
  }, [pathname, hash, items])

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setIsScrolled(latest > 0.02)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  // Scroll animations for navbar
  const navWidth = useTransform(scrollYProgress, [0, 0.05], ["100%", "90%"])
  const navY = useTransform(scrollYProgress, [0, 0.05], [0, 16])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Scroll Progress Bar - opt-in per page */}
      {showProgress && (
        <div className="w-full h-[3px] bg-transparent relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent/80 via-accent to-accent/80 origin-left shadow-lg shadow-accent/20"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      )}
      <motion.nav
        style={{
          width: navWidth,
          y: navY,
          maxWidth: "1200px",
        }}
        className={cn(
          "pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top w-[calc(100%-1rem)] mx-2 sm:mx-0 border",
          "rounded-full",
          isScrolled
            ? "bg-black/75 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] px-3 sm:px-4 py-2 mt-0"
            : "bg-black/40 backdrop-blur-md border-transparent px-4 sm:px-5 py-2.5 mt-3"
        )}
      >
        <div className="flex items-center justify-between w-full gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center size-9 shrink-0">
            <SeraLogo size="sm" />
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            {items.map((item) => {
              const isActive = activeTab === item.name
              const baseCls = cn(
                "relative px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] rounded-full transition-colors duration-300",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground/80 hover:text-foreground"
              )
              const pill = isActive && (
                <motion.div
                  layoutId="liquid-nav-pill"
                  className="absolute inset-0 rounded-full bg-white/10 border border-white/15"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )
              return item.isRouterLink ? (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className={baseCls}
                >
                  <span className="relative z-10">{item.name}</span>
                  {pill}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className={baseCls}
                >
                  <span className="relative z-10">{item.name}</span>
                  {pill}
                </a>
              )
            })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground h-8 px-3">
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-8 px-4 text-[11px] font-mono uppercase tracking-[0.18em] gap-1.5">
              <Link to="/auth">Get Started <ArrowRight className="size-3" /></Link>
            </Button>
          </div>


          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="p-2 lg:hidden text-foreground/80 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Full-Screen Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden -z-10"
                style={{ top: "calc(env(safe-area-inset-top) + 0px)" }}
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden lg:hidden"
              >
                <div className="flex flex-col gap-3 pt-5 pb-3 px-1">
                  <div className="flex flex-col gap-1.5">
                    {items.map((item) => {
                      const isActive = activeTab === item.name
                      const cls = cn(
                        "px-4 py-3.5 text-base font-medium rounded-lg transition-colors min-h-[48px] flex items-center",
                        isActive
                          ? "bg-accent/15 text-foreground border border-accent/30"
                          : "text-foreground/80 hover:bg-foreground/5"
                      )
                      return item.isRouterLink ? (
                        <Link key={item.name} to={item.href} onClick={() => setMenuOpen(false)} className={cls}>
                          {item.name}
                        </Link>
                      ) : (
                        <a key={item.name} href={item.href} onClick={() => setMenuOpen(false)} className={cls}>
                          {item.name}
                        </a>
                      )
                    })}
                  </div>
                  <div className="flex flex-col gap-2.5 pt-4 mt-1 border-t border-border/40">
                    <Button asChild variant="outline" className="w-full rounded-lg h-12 text-base">
                      <Link to="/auth" onClick={() => setMenuOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="w-full rounded-lg shadow-lg shadow-accent/20 bg-accent hover:bg-accent/90 h-12 text-base">
                      <Link to="/auth" onClick={() => setMenuOpen(false)}>Get Started</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
