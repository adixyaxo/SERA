import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface CinematicIntroProps {
  videoSrc?: string;
  /** CSS selector for the phone screen target (defaults to [data-phone-screen]). */
  targetSelector?: string;
  /** ms the video plays fullscreen before morph begins */
  holdDuration?: number;
  /** ms the morph itself takes */
  morphDuration?: number;
  /** Phone <video> ref to sync currentTime at handoff for a seamless cut */
  phoneVideoRef?: React.RefObject<HTMLVideoElement>;
  onComplete?: () => void;
}

const STORAGE_KEY = "sera-intro-played-v1";

/**
 * Apple-style cinematic intro. Plays a fullscreen video, then morphs it into
 * the existing phone mockup using a GSAP timeline (transforms only).
 */
export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  videoSrc = "/hero-video.mp4",
  targetSelector = "[data-phone-screen]",
  holdDuration = 3200,
  morphDuration = 900,
  phoneVideoRef,
  onComplete,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(STORAGE_KEY) === "1";

    if (prefersReduced || alreadyPlayed) {
      setDone(true);
      onComplete?.();
      return;
    }

    // Lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const wrapper = wrapperRef.current!;
    const box = videoBoxRef.current!;
    const video = videoRef.current!;

    // Ensure starting state
    gsap.set(box, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: "top left",
      force3D: true,
    });

    let cancelled = false;
    const tl = gsap.timeline({
      defaults: { ease: "cubic-bezier(0.22,1,0.36,1)" },
    });

    const startMorph = () => {
      if (cancelled) return;
      const target = document.querySelector<HTMLElement>(targetSelector);
      if (!target) {
        finish();
        return;
      }
      const rect = target.getBoundingClientRect();
      const sx = rect.width / window.innerWidth;
      const sy = rect.height / window.innerHeight;

      tl.to(box, {
        x: rect.left,
        y: rect.top,
        scaleX: sx,
        scaleY: sy,
        borderRadius: 34 / Math.max(sx, sy), // pre-scale so visual radius ~34px
        duration: morphDuration / 1000,
      })
        .add(() => {
          // Sync phone video to overlay's currentTime for a perfect handoff
          const phoneVideo = phoneVideoRef?.current;
          if (phoneVideo) {
            try {
              phoneVideo.currentTime = video.currentTime;
              phoneVideo.play().catch(() => {});
            } catch {}
          }
        })
        .to(
          box,
          { opacity: 0, duration: 0.25, ease: "power2.out" },
          ">-0.02"
        )
        .add(finish);
    };

    const finish = () => {
      if (cancelled) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      document.body.style.overflow = prevOverflow;
      // Reveal hero content
      wrapper.dispatchEvent(
        new CustomEvent("sera-intro-done", { bubbles: true })
      );
      setDone(true);
      onComplete?.();
    };

    // Kick off video, then morph after hold
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
      <div ref={videoBoxRef} className="overflow-hidden bg-black will-change-transform">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        {/* Ambient cinematic vignette + soft blue glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)",
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
