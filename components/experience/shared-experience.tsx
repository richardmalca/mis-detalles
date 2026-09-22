"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getExperienceContent, ExperienceKind } from "@/lib/content";
import { supabase } from "@/lib/supabase";
import { OpeningCard } from "./opening-card";
import { RevealSection } from "./reveal-section";
import { LeaveMessageForm } from "./leave-message-form";
import { AnimatedFlower } from "./animated-flower";
import { UniverseCanvas } from "./universe-canvas";
import { useCosmicAudio } from "@/hooks/use-cosmic-audio";
import {
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowDown,
} from "lucide-react";

export function SharedExperience({
  recipientName,
  kind,
  code,
}: {
  recipientName: string;
  kind: ExperienceKind;
  code: string;
}) {
  const [opened, setOpened] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const content = getExperienceContent(kind, recipientName);
  const speedRef = useRef(0.4);
  const coreIntensityRef = useRef(0.001);
  const hasMarkedComplete = useRef(false);
  const autoScrollTimer = useRef<number | null>(null);

  const { isPlaying: isAudioPlaying, start: startAudio, toggle: toggleAudio } = useCosmicAudio();

  function handleOpen() {
    setOpened(true);
    startAudio();
    supabase.rpc("mark_link_opened", { p_code: code }).then(() => {});
  }

  function handleReachEnd() {
    if (hasMarkedComplete.current) return;
    hasMarkedComplete.current = true;
    supabase.rpc("mark_link_completed", { p_code: code }).then(() => {});
  }

  const scrollToNext = useCallback(() => {
    const nextY = window.scrollY + window.innerHeight * 0.88;
    window.scrollTo({ top: nextY, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isAutoAdvancing || !opened) {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
        autoScrollTimer.current = null;
      }
      return;
    }

    autoScrollTimer.current = window.setInterval(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= scrollable - 20) {
        setIsAutoAdvancing(false);
        return;
      }
      scrollToNext();
    }, 5500);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
        autoScrollTimer.current = null;
      }
    };
  }, [isAutoAdvancing, opened, scrollToNext]);

  useEffect(() => {
    let raf = 0;

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

        speedRef.current = 0.4 + progress * 2.5;
        coreIntensityRef.current = Math.max(0.001, (progress - 0.65) * 2.2);
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
        <OpeningCard recipientName={recipientName} onOpen={handleOpen} />
      )}

      {opened && (
        <>
          <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
            <button
              onClick={() => setIsAutoAdvancing((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl shadow-lg transition-all active:scale-95 ${
                isAutoAdvancing
                  ? "border-amber-400/60 bg-amber-400/20 text-amber-200"
                  : "border-white/15 bg-zinc-950/80 text-zinc-300 hover:text-white"
              }`}
              title={isAutoAdvancing ? "Pausar avance automático" : "Reproducción automática"}
            >
              {isAutoAdvancing ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <span className="hidden sm:inline">Pausar</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span className="hidden sm:inline">Automático</span>
                </>
              )}
            </button>

            <button
              onClick={toggleAudio}
              className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl shadow-lg transition-all active:scale-95 ${
                isAudioPlaying
                  ? "border-amber-400/40 bg-zinc-950/85 text-amber-300"
                  : "border-white/15 bg-zinc-950/80 text-zinc-400 hover:text-white"
              }`}
              title={isAudioPlaying ? "Silenciar música cósmica" : "Activar música cósmica"}
            >
              {isAudioPlaying ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
          </div>

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

                <button
                  type="button"
                  onClick={scrollToNext}
                  className="mt-6 flex flex-col items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
                >
                  <span className="text-zinc-400">Toca o desliza para continuar</span>
                  <div className="rounded-full bg-white/10 p-1 animate-bounce">
                    <ChevronDown className="h-4 w-4 text-amber-300" />
                  </div>
                </button>
              </div>
            </RevealSection>

            {content.phrases.map((phrase, idx) => (
              <RevealSection key={idx} className="min-h-[80vh]">
                <div className="max-w-md sm:max-w-xl px-2 text-center flex flex-col items-center gap-6">
                  <p className="text-xl sm:text-3xl font-light leading-relaxed text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)]">
                    “{phrase}”
                  </p>
                  <button
                    type="button"
                    onClick={scrollToNext}
                    className="p-2 text-zinc-500 hover:text-amber-300 transition-colors active:scale-95"
                    aria-label="Siguiente mensaje"
                  >
                    <ArrowDown className="h-4 w-4 opacity-60 hover:opacity-100" />
                  </button>
                </div>
              </RevealSection>
            ))}

            <RevealSection className="min-h-[95vh]" onVisible={handleReachEnd}>
              <div className="flex w-full max-w-md flex-col items-center gap-6 text-center pb-20">
                <AnimatedFlower size={56} />

                <div className="space-y-3 px-2">
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                    {content.finalTitle}
                  </h2>

                  <p className="text-sm sm:text-base leading-relaxed text-zinc-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    {content.finalMessage}
                  </p>
                </div>

                <div className="w-full pt-2">
                  <LeaveMessageForm prompt={content.formPrompt} />
                </div>
              </div>
            </RevealSection>
          </div>
        </>
      )}
    </div>
  );
}
