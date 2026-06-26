import React, { forwardRef } from "react";

interface PhoneMockupProps {
  videoSrc?: string;
  screenRef?: React.Ref<HTMLDivElement>;
  videoRef?: React.Ref<HTMLVideoElement>;
  className?: string;
}

/**
 * Premium iPhone-style mockup. The inner screen div carries `data-phone-screen`
 * so the cinematic intro can measure and morph the fullscreen intro video into it.
 */
export const PhoneMockup = forwardRef<HTMLDivElement, PhoneMockupProps>(
  ({ videoSrc = "/hero-video.mp4", screenRef, videoRef, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative mx-auto ${className}`}
        style={{
          width: "min(320px, 78vw)",
          aspectRatio: "9 / 19.5",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute -inset-10 -z-10 rounded-[60px] blur-3xl opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(11,95,255,0.35), rgba(18,59,140,0.15) 60%, transparent 75%)",
          }}
        />

        {/* Outer bezel / titanium frame */}
        <div
          className="absolute inset-0 rounded-[44px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)_inset]"
          style={{
            background:
              "linear-gradient(145deg,#1a1a1d 0%,#0a0a0c 40%,#0a0a0c 60%,#1f1f22 100%)",
            padding: "8px",
          }}
        >
          {/* Inner bezel rim */}
          <div
            className="relative h-full w-full overflow-hidden rounded-[36px]"
            style={{
              background: "#000",
              boxShadow:
                "inset 0 0 0 1.5px #111, inset 0 0 0 3px rgba(255,255,255,0.04)",
            }}
          >
            {/* Screen — target for morph */}
            <div
              ref={screenRef}
              data-phone-screen
              className="absolute inset-[3px] overflow-hidden rounded-[34px] bg-black"
            >
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Subtle screen vignette + grain */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 80% at 50% 0%, transparent 55%, rgba(0,0,0,0.45) 100%)",
                }}
              />
            </div>

            {/* Dynamic Island */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[10px] z-10 h-[26px] -translate-x-1/2 rounded-full bg-black"
              style={{
                width: "38%",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
              }}
            />
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute -left-[2px] top-[22%] h-[34px] w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[2px] top-[32%] h-[54px] w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[2px] top-[42%] h-[54px] w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -right-[2px] top-[28%] h-[80px] w-[3px] rounded-r-sm bg-neutral-800" />
      </div>
    );
  }
);

PhoneMockup.displayName = "PhoneMockup";
