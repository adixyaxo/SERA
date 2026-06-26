import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface CinematicIntroProps {
  videoSrc?: string;
  targetSelector?: string;
  /** ms the video plays fullscreen before morph begins */
  holdDuration?: number;
  /** ms the morph itself takes */
  morphDuration?: number;
  phoneVideoRef?: React.RefObject<HTMLVideoElement>;
  onComplete?: () => void;
}

/**
 * Apple-style cinematic intro. Plays a fullscreen video, then morphs it into
 * the existing phone mockup. Animates width/height/top/left directly (not
 * scale) so the inner video keeps object-cover without squeezing.
 */
export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  videoSrc = "/hero-video.mp4",
  targetSelector = "[data-phone-screen]",
  holdDuration = 2600,
  morphDuration = 1100,
  phoneVideoRef,
  onComplete,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDone(true);
      onComplete?.();
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const box = boxRef.current!;
    const video = videoRef.current!;
    const vignette = vignetteRef.current;

    gsap.set(box, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      force3D: true,
    });

    let cancelled = false;
    const tl = gsap.timeline();

    const startMorph = () => {
      if (cancelled) return;
      const target = document.querySelector<HTMLElement>(targetSelector);
      if (!target) {
        finish();
        return;
      }
      const rect = target.getBoundingClientRect();

      // Pre-morph: gentle zoom-in beat for cinematic feel
      tl.to(box, {
        scale: 1.04,
        duration: 0.5,
        ease: "power2.inOut",
        transformOrigin: "50% 50%",
      })
        .to(vignette, { opacity: 0.6, duration: 0.4 }, "<")
        .to(box, {
          // Animate raw box geometry so the video (object-cover) never squeezes.
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 34,
          scale: 1,
          duration: morphDuration / 1000,
          ease: "expo.inOut",
        })
        .add(() => {
          const phoneVideo = phoneVideoRef?.current;
          if (phoneVideo) {
            try {
              phoneVideo.currentTime = video.currentTime;
              phoneVideo.play().catch(() => {});
            } catch {}
          }
        })
        .to(box, { opacity: 0, duration: 0.28, ease: "power2.out" }, ">-0.05")
        .add(finish);
    };

    const finish = () => {
      if (cancelled) return;
      document.body.style.overflow = prevOverflow;
      setDone(true);
      onComplete?.();
    };

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
    const timer = window.setTimeout(startMorph, holdDuration);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      tl.kill();
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[100] bg-black"
      aria-hidden
    >
      <div ref={boxRef} className="overflow-hidden bg-black will-change-transform">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        <div
          ref={vignetteRef}
          className="pointer-events-none absolute inset-0 opacity-30 transition-opacity"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 50%, transparent 45%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(40% 40% at 50% 60%, rgba(11,95,255,0.18), transparent 70%)",
          }}
        />
      </div>
    </div>
  );
};

export default CinematicIntro;
