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
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  return (
    <div ref={container} className={cn("relative h-[300vh]", className)}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map((item, index) => {
          const { src, alt, video, poster } = item
          const scale = scales[index % scales.length]
          let positionClasses = ""

          if (index === 1) {
            positionClasses = "[&>div]:!top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]"
          } else if (index === 2) {
            positionClasses = "[&>div]:!top-[10vh] [&>div]:!left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]"
          } else if (index === 3) {
            positionClasses = "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]"
          } else if (index === 4) {
            positionClasses = "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]"
          } else if (index === 5) {
            positionClasses = "[&>div]:!top-[27.5vh] [&>div]:!left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]"
          } else if (index === 6) {
            positionClasses = "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]"
          }

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${positionClasses}`}
            >
              <div className="relative h-[25vh] w-[25vw]">
                {video ? (
                  <video
                    src={src}
                    poster={poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={src || "/placeholder.svg"}
                    alt={alt || `Parallax image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
