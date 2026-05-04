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
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
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
          "pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top",
          // System-wide rounded rectangle (4 equal corners) with subtle backdrop and glow
          "rounded-lg",
          isScrolled
            ? "bg-[#000000]/70 backdrop-blur-md border-border/50 shadow-sm px-6 py-3 mt-0"
            : "bg-[#000000]/50 backdrop-blur-sm border-transparent px-6 py-4 mt-2 shadow-sm"
        )}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo - Text removed for minimalism */}
          <Link to="/landing" className="flex items-center justify-center size-10 shrink-0">
            <SeraLogo size="sm" />
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-6">
                {items.map((item) => {
                  const isActive = activeTab === item.name
                  return item.isRouterLink ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setActiveTab(item.name)}
                      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all duration-200"
                    >
                      <span className="relative z-10"><TextRoll>{item.name}</TextRoll></span>
                      {isActive && (
                        <motion.div
                          layoutId="liquid-nav-pill"
                          className="absolute inset-0 rounded-lg bg-foreground/5 dark:bg-white/10 border border-accent/20"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setActiveTab(item.name)}
                      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all duration-200"
                    >
                      <span className="relative z-10"><TextRoll>{item.name}</TextRoll></span>
                      {isActive && (
                        <motion.div
                          layoutId="liquid-nav-pill"
                          className="absolute inset-0 rounded-lg bg-foreground/5 dark:bg-white/10 border border-accent/20"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </a>
                  )
                })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:text-foreground">
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-lg shadow-lg shadow-accent/20 bg-accent hover:bg-accent/90">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 lg:hidden text-foreground/80 hover:text-foreground transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden lg:hidden"
            >
              <div className="flex flex-col gap-4 pt-4 pb-2 px-2">
                 <div className="flex flex-col gap-2">
                   {items.map((item) => (
                     item.isRouterLink ? (
                       <Link
                         key={item.name}
                         to={item.href}
                         onClick={() => setMenuOpen(false)}
                         className="px-4 py-3 text-base font-medium rounded-lg hover:bg-muted/50 transition-colors"
                       >
                         {item.name}
                       </Link>
                     ) : (
                       <a
                         key={item.name}
                         href={item.href}
                         onClick={() => setMenuOpen(false)}
                         className="px-4 py-3 text-base font-medium rounded-lg hover:bg-muted/50 transition-colors"
                       >
                         {item.name}
                       </a>
                     )
                   ))}
                 </div>
                 <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                   <Button asChild variant="outline" className="w-full rounded-lg">
                     <Link to="/auth">Login</Link>
                   </Button>
                   <Button asChild className="w-full rounded-lg shadow-lg shadow-accent/20 bg-accent hover:bg-accent/90">
                     <Link to="/auth">Get Started</Link>
                   </Button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
