"use client"

import { cn } from "@/lib/utils"
import React from "react"

export interface ProgressiveBlurProps {
  className?: string
  height?: string
  position?: "top" | "bottom" | "both"
  blurLevels?: number[]
  color?: string
}

export function ProgressiveBlur({
  className,
  height = "30%",
  position = "bottom",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
  color = "#000000",
}: ProgressiveBlurProps) {
  const divElements = Array(blurLevels.length - 2).fill(null)

  // Convert hex to rgb for CSS
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgb = hexToRgb(color)
  const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 inset-x-0",
        className,
        position === "top"
          ? "top-0"
          : position === "bottom"
            ? "bottom-0"
            : "inset-y-0",
      )}
      style={{
        height: position === "both" ? "100%" : height,
      }}
    >
      {/* First blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage:
            position === "bottom"
              ? `linear-gradient(to bottom, rgba(${rgbString},0) 0%, rgba(${rgbString},1) 12.5%, rgba(${rgbString},1) 25%, rgba(${rgbString},0) 37.5%)`
              : position === "top"
                ? `linear-gradient(to top, rgba(${rgbString},0) 0%, rgba(${rgbString},1) 12.5%, rgba(${rgbString},1) 25%, rgba(${rgbString},0) 37.5%)`
                : `linear-gradient(rgba(${rgbString},0) 0%, rgba(${rgbString},1) 5%, rgba(${rgbString},1) 95%, rgba(${rgbString},0) 100%)`,
          WebkitMaskImage:
            position === "bottom"
              ? `linear-gradient(to bottom, rgba(${rgbString},0) 0%, rgba(${rgbString},1) 12.5%, rgba(${rgbString},1) 25%, rgba(${rgbString},0) 37.5%)`
              : position === "top"
                ? `linear-gradient(to top, rgba(${rgbString},0) 0%, rgba(${rgbString},1) 12.5%, rgba(${rgbString},1) 25%, rgba(${rgbString},0) 37.5%)`
                : `linear-gradient(rgba(${rgbString},0) 0%, rgba(${rgbString},1) 5%, rgba(${rgbString},1) 95%, rgba(${rgbString},0) 100%)`,
        }}
      />

      {/* Middle blur layers */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1
        const startPercent = blurIndex * 12.5
        const midPercent = (blurIndex + 1) * 12.5
        const endPercent = (blurIndex + 2) * 12.5

        const maskGradient =
          position === "bottom"
            ? `linear-gradient(to bottom, rgba(${rgbString},0) ${startPercent}%, rgba(${rgbString},1) ${midPercent}%, rgba(${rgbString},1) ${endPercent}%, rgba(${rgbString},0) ${endPercent + 12.5}%)`
            : position === "top"
              ? `linear-gradient(to top, rgba(${rgbString},0) ${startPercent}%, rgba(${rgbString},1) ${midPercent}%, rgba(${rgbString},1) ${endPercent}%, rgba(${rgbString},0) ${endPercent + 12.5}%)`
              : `linear-gradient(rgba(${rgbString},0) 0%, rgba(${rgbString},1) 5%, rgba(${rgbString},1) 95%, rgba(${rgbString},0) 100%)`

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient,
            }}
          />
        )
      })}

      {/* Last blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          maskImage:
            position === "bottom"
              ? `linear-gradient(to bottom, rgba(${rgbString},0) 87.5%, rgba(${rgbString},1) 100%)`
              : position === "top"
                ? `linear-gradient(to top, rgba(${rgbString},0) 87.5%, rgba(${rgbString},1) 100%)`
                : `linear-gradient(rgba(${rgbString},0) 0%, rgba(${rgbString},1) 5%, rgba(${rgbString},1) 95%, rgba(${rgbString},0) 100%)`,
          WebkitMaskImage:
            position === "bottom"
              ? `linear-gradient(to bottom, rgba(${rgbString},0) 87.5%, rgba(${rgbString},1) 100%)`
              : position === "top"
                ? `linear-gradient(to top, rgba(${rgbString},0) 87.5%, rgba(${rgbString},1) 100%)`
                : `linear-gradient(rgba(${rgbString},0) 0%, rgba(${rgbString},1) 5%, rgba(${rgbString},1) 95%, rgba(${rgbString},0) 100%)`,
        }}
      />
    </div>
  )
}

export default ProgressiveBlur
