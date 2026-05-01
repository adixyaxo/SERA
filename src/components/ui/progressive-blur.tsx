import React from "react";

type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom" | "left" | "right";
  height?: string;
  blurAmount?: string;
};

const ProgressiveBlur = ({
  className = "",
  backgroundColor = "hsl(var(--background))",
  position = "bottom",
  height = "150px",
  blurAmount = "8px",
}: ProgressiveBlurProps) => {
  const isTop = position === "top";
  const isBottom = position === "bottom";
  const isLeft = position === "left";
  const isRight = position === "right";

  return (
    <div
      className={`pointer-events-none absolute select-none z-10 ${className}`}
      style={{
        top: isTop || isLeft || isRight ? 0 : "auto",
        bottom: isBottom || isLeft || isRight ? 0 : "auto",
        left: isLeft || isTop || isBottom ? 0 : "auto",
        right: isRight || isTop || isBottom ? 0 : "auto",
        height: isTop || isBottom ? height : "100%",
        width: isLeft || isRight ? height : "100%",
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : isBottom
          ? `linear-gradient(to bottom, transparent, ${backgroundColor})`
          : isLeft
          ? `linear-gradient(to left, transparent, ${backgroundColor})`
          : `linear-gradient(to right, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)`
          : isBottom
          ? `linear-gradient(to top, ${backgroundColor} 50%, transparent)`
          : isLeft
          ? `linear-gradient(to right, ${backgroundColor} 50%, transparent)`
          : `linear-gradient(to left, ${backgroundColor} 50%, transparent)`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
};

export { ProgressiveBlur };
