"use client";

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Section from "@/components/ui/section"

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

      {/* --------------- HERO SECTION --------------- */}
      <Section className="relative min-h-[calc(100vh-100px)] mt-[100px] flex flex-col justify-center pb-24 bg-background overflow-hidden">
        {/* Subtle Gradient Background */}
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
              <img
                className="rounded-[2rem] object-cover w-full h-[280px] md:h-[350px] border border-border/50 shadow-xl"
                src="https://images.unsplash.com/photo-1518702255759-1d339b0f0c28?w=900&auto=format&fit=crop&q=80"
                alt="Cognitive Systems"
                width={600}
                height={400}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col justify-center"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Core Philosophy</p>
              <h2 className="text-3xl md:text-5xl font-medium leading-tight">
                Most systems ask <span className="text-muted-foreground">"what should you do next?"</span>
                <br />
                SERA asks <span className="text-foreground">"given your current state, environment, and goals � what is realistically optimal right now?"</span>
              </h2>
              <p className="mt-8 text-muted-foreground max-w-2xl">
                It doesn't just manage tasks. It continuously negotiates reality on your behalf �
                acting as a mixed-initiative intelligent system that interprets input, predicts
                constraints, and restructures schedules in real time.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ACHIEVEMENTS */}
      <Section id="achievements" className="px-6 py-24 border-t border-border/50">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground">{item.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRINCIPLES */}
      <Section id="principles" className="px-6 py-32 border-t border-border/50">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4 text-center">Our Principles</p>
          <h2 className="text-3xl md:text-5xl font-medium leading-tight text-center mb-16">
            Built on cognitive science.<br />
            <span className="text-muted-foreground">Not productivity theater.</span>
          </h2>
          <div className="space-y-6">
            {/* Principles content will be added here */}
          </div>
        </div>
      </Section>

    </div>
  );
}