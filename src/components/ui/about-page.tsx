"use client";

import { motion } from "framer-motion"
import Section from "@/components/ui/section"
import aboutHero from "@/assets/about-hero.jpg"

interface AboutPageProps {
  achievements?: Array<{ label: string; value: string }>
}

const defaultAchievements = [
  { label: "Routines Adapted", value: "12k+" },
  { label: "Missed Blocks Recovered", value: "87%" },
  { label: "Daily Adjustments", value: "3.4x" },
  { label: "Sync Uptime", value: "99.9%" },
]


export default function AboutPage({
  achievements = defaultAchievements,
}: AboutPageProps) {
  return (
    <div className="flex flex-col">
      {/* HERO — research paper style */}
      <Section className="relative min-h-[calc(100vh-100px)] mt-[100px] flex flex-col justify-center pb-24 bg-background overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 w-full">
          {/* Paper-style abstract block — text first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            <div className="paper-section-number mb-4">Abstract — Core Philosophy</div>
            <div className="paper-separator mb-8" />
            <h2 className="text-2xl md:text-4xl font-medium leading-[1.35] text-justify hyphens-auto tracking-tight">
              Most systems ask <span className="text-muted-foreground italic">"what should you do next?"</span> SERA asks <span className="text-foreground">"given your current state, environment, and goals — what is realistically optimal right now?"</span>
            </h2>
            <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed text-justify hyphens-auto">
              It doesn't just manage tasks. It continuously negotiates reality on your behalf — acting as a mixed-initiative intelligent system that interprets input, predicts constraints, and restructures schedules in real time.
            </p>
          </motion.div>

          {/* Gradient image moved below */}
          <motion.figure
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-4"
          >
            <img
              className="rounded-[2rem] object-cover w-full h-[280px] md:h-[450px] border border-border/50 shadow-2xl"
              src={aboutHero}
              alt="SERA — Adaptive Intelligence"
            />
            <figcaption className="mt-3 paper-meta text-center">
              Fig. 1 — Conceptual representation of adaptive routine intelligence.
            </figcaption>
          </motion.figure>
        </div>
      </Section>

      {/* ACHIEVEMENTS — plain text, paper style (compact) */}
      <Section id="achievements" className="px-6 py-12 border-t border-border/50">
        <div className="mx-auto max-w-3xl">
          <div className="paper-section-number mb-4 text-center text-[10px]">By the Numbers</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-3">
            {achievements.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-medium tracking-[-0.04em] text-foreground tabular-nums">
                  {item.value}
                </div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}