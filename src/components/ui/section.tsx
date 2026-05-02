import { cn } from "@/lib/utils"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"

interface SectionProps {
  id?: string
  className?: string
  children?: React.ReactNode
  showBlur?: boolean
}

export default function Section({ id, className, children, showBlur = false }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-24 md:py-32 px-6", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
      {showBlur && (
        <ProgressiveBlur position="bottom" height="25%" />
      )}
    </section>
  )
}
