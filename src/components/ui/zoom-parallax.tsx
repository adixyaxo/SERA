"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface MediaItem {
  src: string
  alt?: string
  /** If true, render as a <video> instead of <img> */
  video?: boolean
  poster?: string
}

interface ZoomParallaxProps {
  images: MediaItem[]
  className?: string
}

export function ZoomParallax({ images, className }: ZoomParallaxProps) {
  const item = images[0]
  if (!item) return null
  const { src, alt, video, poster } = item
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {video ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={src || "/placeholder.svg"}
          alt={alt || "Hero"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  )
}
