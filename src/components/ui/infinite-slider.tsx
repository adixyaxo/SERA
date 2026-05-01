import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function InfiniteSlider({
  children,
  speed = 40,
  speedOnHover = 20,
  gap = 112,
  className,
}: {
  children: React.ReactNode
  speed?: number
  speedOnHover?: number
  gap?: number
  className?: string
}) {
  return (
    <div className={cn("flex overflow-hidden relative w-full", className)}>
      <motion.div
        className="flex min-w-full shrink-0"
        style={{ gap: `${gap}px` }}
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="flex shrink-0 items-center justify-around" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center justify-around" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
