"use client";

import { useEffect, useRef, useState } from "react";
import { getExperienceContent, ExperienceKind } from "@/lib/content";
import { OpeningCard } from "./opening-card";
import { RevealSection } from "./reveal-section";
import { LeaveMessageForm } from "./leave-message-form";
import { AnimatedFlower } from "./animated-flower";
import { UniverseCanvas } from "./universe-canvas";
import { Sparkles, ChevronDown } from "lucide-react";

export function SharedExperience({
  recipientName,
  kind,
}: {
  recipientName: string;
  kind: ExperienceKind;
}) {
  const [opened, setOpened] = useState(false);
  const content = getExperienceContent(kind, recipientName);
  const speedRef = useRef(0.4);
  const coreIntensityRef = useRef(0.001);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  useEffect(() => {
    let raf = 0;

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

        speedRef.current = 0.4 + progress * 3.0;
        coreIntensityRef.current = Math.max(0.001, (progress - 0.5) * 3.0);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full text-white selection:bg-amber-500/30">
      <UniverseCanvas speedRef={speedRef} coreIntensityRef={coreIntensityRef} />

      {!opened && (
        <OpeningCard
          recipientName={recipientName}
          onOpen={() => setOpened(true)}
        />
      )}

      {opened && (
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6">
          <RevealSection className="min-h-[92vh]">
            <div className="flex max-w-lg flex-col items-center gap-4 sm:gap-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-300">
                <Sparkles className="h-3 w-3" />
                {content.badge}
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-lg">
                {recipientName}
              </h1>

              <p className="text-base sm:text-xl font-light leading-relaxed text-zinc-200 drop-shadow">
                {content.intro}
              </p>

              <div className="pt-2">
                <AnimatedFlower size={46} />
              </div>

              <div className="mt-6 flex flex-col items-center gap-1 text-xs text-zinc-400 animate-bounce">
                <span>Desliza para continuar</span>
                <ChevronDown className="h-4 w-4 text-amber-300" />
              </div>
            </div>
          </RevealSection>

          {content.phrases.map((phrase, idx) => (
            <RevealSection key={idx} className="min-h-[80vh]">
              <div className="max-w-md sm:max-w-xl px-2 text-center">
                <p className="text-xl sm:text-3xl font-light leading-relaxed text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  “{phrase}”
                </p>
              </div>
            </RevealSection>
          ))}

          <RevealSection className="min-h-[90vh]">
            <div className="flex w-full max-w-md flex-col items-center gap-5 text-center pb-12">
              <AnimatedFlower size={56} />

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-200 drop-shadow">
                {content.finalTitle}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-zinc-200 drop-shadow">
                {content.finalMessage}
              </p>

              <div className="w-full pt-2">
                <LeaveMessageForm prompt={content.formPrompt} />
              </div>
            </div>
          </RevealSection>
        </div>
      )}
    </div>
  );
}
