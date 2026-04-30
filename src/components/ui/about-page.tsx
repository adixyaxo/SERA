import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import aboutHero from "@/assets/about-hero.jpg";
import aboutCard from "@/assets/about-card.jpg";

interface AboutPageProps {
  achievements?: Array<{ label: string; value: string }>;
}

const defaultAchievements = [
  { label: "Active Users", value: "12K+" },
  { label: "Tasks Negotiated", value: "1.2M+" },
  { label: "Plans Adapted Daily", value: "98%" },
  { label: "Research-Backed Pillars", value: "06" },
];

export default function AboutPage({
  achievements = defaultAchievements,
}: AboutPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32 border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-50">
          <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid gap-12 md:grid-cols-2 md:gap-16 items-end"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-muted-foreground mb-6">
                About SERA
              </span>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                The SERA ecosystem{" "}
                <span className="text-muted-foreground">
                  brings together intelligence, intent, and execution.
                </span>
              </h1>
            </div>

            <div className="space-y-6 md:pb-2">
              <p className="text-lg text-muted-foreground leading-relaxed">
                SERA is more than a planner. It's an adaptive cognitive layer —
                spanning capture, scheduling, and reflection — built so people
                can stop managing time and start negotiating reality.
              </p>
              <Button asChild size="lg" className="group">
                <Link to="/landing">
                  Learn more
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- ABOUT SECTION ---------------- */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="max-w-3xl mb-16 md:mb-20">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              About Us
            </p>
            <h2 className="text-3xl md:text-5xl font-medium leading-tight">
              A small team building the missing layer between intention and
              execution.
            </h2>
          </div>

          {/* ---------------- LAST THREE CARDS ---------------- */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* LEFT BIG IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden glass min-h-[420px] md:min-h-[640px]"
            >
              <img
                src={aboutHero}
                alt="SERA adaptive scheduling visualization"
                width={1280}
                height={1600}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Our craft
                </p>
                <h3 className="text-2xl md:text-3xl font-medium leading-tight">
                  Intelligence that moves with you, not against you.
                </h3>
              </div>
            </motion.div>

            {/* RIGHT TWO CARDS */}
            <div className="grid gap-6">
              {/* FIRST CARD */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[300px]"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    01 — Mission
                  </p>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">
                    Accelerate human follow-through.
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Most people don't lack discipline — they lack a system that
                    keeps up with their reality. SERA closes the gap between
                    what you plan and what actually happens.
                  </p>
                </div>
                <Button asChild variant="ghost" className="self-start mt-6 -ml-3 group">
                  <Link to="/landing">
                    Learn more
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </motion.div>

              {/* SECOND CARD */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative glass rounded-3xl overflow-hidden min-h-[300px]"
              >
                <img
                  src={aboutCard}
                  alt="Adaptive design visualization"
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
                <div className="relative p-8 md:p-10 h-full flex flex-col justify-end">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    02 — Design
                  </p>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">
                    Future-ready, calmly intelligent.
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A scalable architecture that pairs precise scheduling with
                    aesthetics that disappear — so attention stays where it
                    belongs.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ---------------- ACHIEVEMENTS ---------------- */}
          <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50 rounded-2xl overflow-hidden">
            {achievements.map((a) => (
              <div key={a.label} className="bg-background p-8 text-center md:text-left">
                <div className="text-3xl md:text-4xl font-semibold tracking-tight">
                  {a.value}
                </div>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {a.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
