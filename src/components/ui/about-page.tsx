import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface AboutPageProps {
  achievements?: Array<{ label: string; value: string }>
}

const defaultAchievements = [
  { label: "Companies Supported", value: "300+" },
  { label: "Projects Finalized", value: "800+" },
  { label: "Happy Customers", value: "99%" },
  { label: "Recognized Awards", value: "10+" },
]

export default function AboutPage({
  achievements = defaultAchievements,
}: AboutPageProps) {
  return (
    <div className="flex flex-col">

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative min-h-[calc(100vh-100px)] mt-[100px] flex flex-col justify-center pb-24 bg-background overflow-hidden">
        {/* Subtle Ambient Background */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-6xl space-y-6 px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img
              className="rounded-[2rem] object-cover w-full h-[280px] md:h-[450px] border border-border/50 shadow-2xl"
              src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_hero_gradient.jpg"
              alt="SERA Hero"
              width={1200}
              height={600}
            />
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-16 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.15] text-balance">
                The SERA <span className="text-muted-foreground">ecosystem</span>{" "}
                <span className="text-foreground/40">
                  brings together our models, products, and platforms.
                </span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="space-y-6 text-muted-foreground flex flex-col justify-center"
            >
              <p className="text-lg leading-relaxed text-pretty">
                SERA is evolving to be more than just the models. It supports an entire ecosystem — 
                from products to the APIs and platforms helping developers and businesses innovate.
              </p>
              <div>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full gap-2 px-6"
                >
                  <Link to="#philosophy">
                    <span>Explore Philosophy</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT SECTION ---------------- */}
      <section className="py-24 md:py-32 border-t border-border/50">
        <div className="mx-auto max-w-6xl space-y-20 px-6">

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 md:grid-cols-2 md:gap-16 items-end"
          >
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">About Us</p>
              <h2 className="text-5xl md:text-6xl font-medium tracking-tight text-foreground">
                Designing <br/><span className="text-muted-foreground">the future.</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground text-pretty max-w-md">
              SERA is a passionate team dedicated to creating innovative solutions
              that empower individuals and businesses to thrive in the digital age.
            </p>
          </motion.div>

          {/* ---------------- CARDS (MINIMALIST LAYOUT) ---------------- */}
          <div className="flex flex-col lg:flex-row gap-6 mt-16">
            
            {/* LEFT BIG IMAGE */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:flex-1 relative group overflow-hidden rounded-[2rem] border border-border/50"
            >
              <img
                src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_chat_gradient.png"
                alt="SERA interface preview"
                className="object-cover w-full h-[400px] lg:h-[100%] transition-transform duration-700 ease-out group-hover:scale-105"
                width={800}
                height={550}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* RIGHT TWO CARDS */}
            <div className="flex flex-col gap-6 lg:flex-1">
              {/* FIRST CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 transition-all hover:shadow-lg hover:border-foreground/20"
              >
                <div className="flex flex-col h-full justify-between gap-12">
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                    <img
                      src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_moon.png"
                      alt="Innovation"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      width={600}
                      height={400}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight">Accelerate Growth</h3>
                    <p className="mt-3 text-base text-muted-foreground text-pretty">
                      Our solutions drive innovation, efficiency, and measurable impact for businesses and individuals alike.
                    </p>
                    <div className="mt-6 flex items-center text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      Learn More <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SECOND CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-muted/30 p-8 transition-all hover:bg-muted/50"
              >
                <div className="flex flex-col h-full justify-between gap-12">
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight">Future-Ready Design</h3>
                    <p className="mt-3 text-base text-muted-foreground text-pretty">
                      Intuitive, scalable designs for modern workflows combining extreme aesthetics with cognitive functionality.
                    </p>
                  </div>
                  <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-border/50">
                    <img
                      src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_hero_gradient.jpg"
                      alt="Secondary card"
                      className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
