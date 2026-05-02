"use client";

import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  wrap,
} from "framer-motion";
import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
  type ReactNode,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type Variants = "default" | "masonry" | "polaroid";

const GridVariantContext = createContext<Variants>("default");

const rowVariants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: () => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.random() + 0.2,
      duration: 1.2,
      ease: cubicBezier(0.18, 0.71, 0.11, 1),
    },
  }),
};

interface DraggableContainerProps {
  className?: string;
  children: ReactNode;
  variant?: Variants;
}

export const DraggableContainer = ({
  className,
  children,
  variant = "default",
}: DraggableContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const container = ref.current?.getBoundingClientRect();
    if (!container) return;

    const { width, height } = container;

    const xUnsub = x.on("change", (latest) => {
      const wrappedX = wrap(-(width / 2), 0, latest);
      x.set(wrappedX);
    });

    const yUnsub = y.on("change", (latest) => {
      const wrappedY = wrap(-(height / 2), 0, latest);
      y.set(wrappedY);
    });

    const handleWheel = (event: WheelEvent) => {
      if (!isDragging) {
        animate(y, y.get() - event.deltaY * 1.5, {
          type: "tween",
          duration: 1,
          ease: cubicBezier(0.18, 0.71, 0.11, 1),
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      xUnsub();
      yUnsub();
      window.removeEventListener("wheel", handleWheel);
    };
  }, [x, y, isDragging]);

  return (
    <GridVariantContext.Provider value={variant}>
      <div
        className={cn(
          "relative h-screen w-full overflow-hidden cursor-grab active:cursor-grabbing select-none",
          className,
        )}
      >
        <motion.div
          ref={ref}
          drag
          dragMomentum={true}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          style={{ x, y }}
          className="absolute will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    </GridVariantContext.Provider>
  );
};

interface GridItemProps {
  children: ReactNode;
  className?: string;
}

export const GridItem = ({ children, className }: GridItemProps) => {
  const variant = useContext(GridVariantContext);

  const gridItemStyles = cva(
    "overflow-hidden hover:cursor-pointer w-full h-full will-change-transform",
    {
      variants: {
        variant: {
          default: "rounded-md",
          masonry: "even:mt-[60%] rounded-md",
          polaroid:
            "border-[10px] border-b-[28px] border-white shadow-xl even:rotate-3 odd:-rotate-2 hover:rotate-0 transition-transform ease-out duration-300 even:mt-[60%]",
        },
      },
      defaultVariants: { variant: "default" },
    },
  );

  return (
    <motion.div
      variants={rowVariants}
      initial="initial"
      animate="animate"
      className={cn(gridItemStyles({ variant }), className)}
    >
      {children}
    </motion.div>
  );
};

interface GridBodyProps {
  children: ReactNode;
  className?: string;
}

export const GridBody = memo(({ children, className }: GridBodyProps) => {
  const variant = useContext(GridVariantContext);

  const gridBodyStyles = cva("grid grid-cols-[repeat(6,1fr)] h-fit w-fit", {
    variants: {
      variant: {
        default: "gap-8 p-6 md:gap-16 md:p-10",
        masonry: "gap-x-8 px-6 md:gap-x-16 md:px-10",
        polaroid: "gap-x-8 px-6 md:gap-x-16 md:px-10",
      },
    },
    defaultVariants: { variant: "default" },
  });

  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={cn(gridBodyStyles({ variant }), className)}>
          {children}
        </div>
      ))}
    </>
  );
});

GridBody.displayName = "GridBody";
