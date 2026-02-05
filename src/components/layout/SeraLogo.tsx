import { motion } from "framer-motion";

interface SeraLogoProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function SeraLogo({ size = "md", animate = true }: SeraLogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <motion.div
      className={`relative ${sizes[size]} rounded-xl bg-gradient-to-br from-primary via-accent to-primary overflow-hidden`}
      animate={animate ? {
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      } : undefined}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      style={{ backgroundSize: "200% 200%" }}
    >
      {/* Shine effect */}
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* S letter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">S</span>
      </div>
    </motion.div>
  );
}
