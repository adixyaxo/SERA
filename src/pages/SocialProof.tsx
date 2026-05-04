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
  { name: "Social Proof", href: "/social-proof", isRouterLink: true },
];

const testimonials = [
  { id: 1, quote: "SERA bends to my day, not the other way around.", name: "Aria Chen", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop" },
  { id: 2, quote: "I stopped re-planning every morning.", name: "Marcus Hale", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop" },
  { id: 3, quote: "Voice-first, brain-aware. Feels like a co-pilot.", name: "Imani Reed", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop" },
  { id: 4, quote: "Cancelled three productivity apps in a week.", name: "Theo Park", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop" },
  { id: 5, quote: "Treats interruptions as data, not failures.", name: "Sloane Vex", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&auto=format&fit=crop" },
  { id: 6, quote: "Plans actually match reality now.", name: "Daniel Yu", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80&auto=format&fit=crop" },
  { id: 7, quote: "Adaptive scheduling done right. Finally.", name: "Lena Marsh", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&auto=format&fit=crop" },
  { id: 8, quote: "I forget I'm using software.", name: "Owen Frey", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop" },
];

export default function SocialProof() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <LiquidNavbar items={menuItems} />
      <DraggableContainer variant="masonry" className="pt-[80px]">
        <GridBody>
          {testimonials.map((t) => (
            <GridItem key={t.id} className="relative h-64 w-44 md:h-96 md:w-72">
              <img
                src={t.img}
                alt={t.name}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="text-[11px] md:text-sm text-foreground leading-snug font-medium line-clamp-4">
                  "{t.quote}"
                </p>
                <p className="mt-2 text-[10px] md:text-xs font-semibold tracking-tight text-muted-foreground">— {t.name}</p>
              </div>
            </GridItem>
          ))}
        </GridBody>
      </DraggableContainer>
    </main>
  );
}
