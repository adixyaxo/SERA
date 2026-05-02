import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidNavbar } from "@/components/layout/LiquidNavbar";
import {
  DraggableContainer,
  GridBody,
  GridItem,
} from "@/components/ui/infinite-drag-scroll";

const menuItems = [
  { name: "Home", href: "/", isRouterLink: true },
  { name: "About", href: "/about", isRouterLink: true },
  { name: "Demo", href: "/demo", isRouterLink: true },
  { name: "Pricing", href: "/pricing", isRouterLink: true },
];

const testimonials = [
  {
    id: 1,
    quote: "SERA is the first system that bends to my day instead of the other way around.",
    name: "Aria Chen",
    role: "Product Lead, Loop",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    quote: "I stopped re-planning every morning. SERA does it before I open the laptop.",
    name: "Marcus Hale",
    role: "Engineer, Stratus",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    quote: "Voice-first, brain-aware. It feels less like an app and more like a co-pilot.",
    name: "Imani Reed",
    role: "Founder, Quietwork",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    quote: "Cancelled three productivity apps the week I started using SERA.",
    name: "Theo Park",
    role: "Designer, Northform",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    quote: "It treats interruptions as data, not failures. Game-changer.",
    name: "Sloane Vex",
    role: "Researcher, MIT",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    quote: "My team's weekly retros got 40% shorter. Plans actually match reality now.",
    name: "Daniel Yu",
    role: "EM, Slate",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 7,
    quote: "Adaptive scheduling done right. Finally.",
    name: "Lena Marsh",
    role: "Operator, Verge",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 8,
    quote: "I forget I'm using software. That's the highest compliment I can give.",
    name: "Owen Frey",
    role: "Writer, Substack",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop",
  },
];

export default function SocialProof() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LiquidNavbar items={menuItems} />

      <section className="relative pt-[140px] pb-12 px-6">
        <div aria-hidden className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_0%,hsl(var(--accent)/0.08)_0%,transparent_60%)]" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-5">Social Proof</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05]">
            Real people. <span className="text-muted-foreground">Realer days.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Drag, scroll, hover. Every voice is from a beta operator who replaced their stack with SERA.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs">
            <Star className="size-3 fill-accent text-accent" />
            <span className="font-medium">4.9 avg</span>
            <span className="text-muted-foreground">· 320+ beta users</span>
          </div>
        </div>
      </section>

      <DraggableContainer variant="masonry" className="border-y border-border/40">
        <GridBody>
          {testimonials.map((t) => (
            <GridItem key={t.id} className="relative h-64 w-44 md:h-96 md:w-72 group">
              <img
                src={t.img}
                alt={t.name}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="text-[11px] md:text-sm text-foreground leading-snug font-medium line-clamp-4">
                  "{t.quote}"
                </p>
                <div className="mt-3 pt-3 border-t border-foreground/10">
                  <p className="text-[10px] md:text-xs font-semibold tracking-tight">{t.name}</p>
                  <p className="text-[9px] md:text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </GridItem>
          ))}
        </GridBody>
      </DraggableContainer>

      <section className="px-6 py-24 text-center">
        <h2 className="text-2xl md:text-4xl font-medium tracking-tight">
          Join the people who stopped fighting their schedule.
        </h2>
        <div className="mt-8">
          <Button asChild size="lg" className="rounded-lg">
            <Link to="/auth">
              Start adapting <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 z-30"
      >
        drag · scroll · explore
      </motion.div>
    </main>
  );
}
