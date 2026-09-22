"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getExperienceContent, ExperienceKind } from "@/lib/content";
import { supabase } from "@/lib/supabase";
import { OpeningCard } from "./opening-card";
import { AnimatedFlower } from "./animated-flower";
import { LeaveMessageForm } from "./leave-message-form";
import { useCosmicAudio } from "@/hooks/use-cosmic-audio";
import { useGalaxyCanvas } from "@/hooks/use-galaxy-canvas";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Heart,
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
  const [step, setStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const content = getExperienceContent(kind, recipientName);
  const hasMarkedComplete = useRef(false);
  const autoPlayTimer = useRef<number | null>(null);

  const {
    canvasRef,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useGalaxyCanvas();

  const { isPlaying: isAudioPlaying, start: startAudio, toggle: toggleAudio } =
    useCosmicAudio();

  const totalSteps = 1 + content.phrases.length + 1;

  function handleOpen() {
    setOpened(true);
    startAudio();
    supabase.rpc("mark_link_opened", { p_code: code }).then(() => {});
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#ffd700", "#ffffff", "#f59e0b"],
    });
  }

  const goNext = useCallback(() => {
    setStep((prev) => {
      const next = Math.min(prev + 1, totalSteps - 1);
      if (next === totalSteps - 1 && !hasMarkedComplete.current) {
        hasMarkedComplete.current = true;
        supabase.rpc("mark_link_completed", { p_code: code }).then(() => {});
      }
      return next;
    });
  }, [totalSteps, code]);

  const goPrev = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !opened) {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
      return;
    }

    autoPlayTimer.current = window.setInterval(() => {
      setStep((curr) => {
        if (curr >= totalSteps - 1) {
          setIsAutoPlaying(false);
          return curr;
        }
        const nxt = curr + 1;
        if (nxt === totalSteps - 1 && !hasMarkedComplete.current) {
          hasMarkedComplete.current = true;
          supabase.rpc("mark_link_completed", { p_code: code }).then(() => {});
        }
        return nxt;
      });
    }, 5200);

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
    };
  }, [isAutoPlaying, opened, totalSteps, code]);

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-black text-white select-none">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 block h-full w-full touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.75)_100%)]" />

      {!opened && (
        <OpeningCard recipientName={recipientName} onOpen={handleOpen} />
      )}

      {opened && (
        <>
          <div className="absolute top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl shadow-lg transition-all active:scale-95 ${
                isAutoPlaying
                  ? "border-amber-400/60 bg-amber-400/20 text-amber-200"
                  : "border-white/15 bg-zinc-950/80 text-zinc-300 hover:text-white"
              }`}
              title={isAutoPlaying ? "Pausar avance automático" : "Reproducción automática"}
            >
              {isAutoPlaying ? (
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
              title={isAudioPlaying ? "Silenciar música" : "Activar música"}
            >
              {isAudioPlaying ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="absolute top-4 left-4 z-40 flex items-center gap-2 pointer-events-none">
            <span className="rounded-full border border-white/15 bg-zinc-950/80 px-3 py-1 text-[11px] font-semibold text-zinc-300 backdrop-blur-md">
              {step + 1} / {totalSteps}
            </span>
          </div>

          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <div className="w-full max-w-lg pointer-events-auto">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 280 }}
                    className="relative flex flex-col items-center gap-4 rounded-3xl border border-amber-400/30 bg-zinc-950/90 p-6 sm:p-8 text-center shadow-[0_0_60px_-15px_rgba(251,191,36,0.35)] backdrop-blur-2xl"
                  >
                    <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl pointer-events-none bg-amber-400/20" />

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      {content.badge}
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow">
                      {recipientName}
                    </h1>

                    <p className="text-sm sm:text-base font-light leading-relaxed text-zinc-200">
                      {content.intro}
                    </p>

                    <div className="py-2">
                      <AnimatedFlower size={52} />
                    </div>

                    <button
                      type="button"
                      onClick={goNext}
                      className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95"
                    >
                      <span>Descubrir mensaje</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}

                {step > 0 && step <= content.phrases.length && (
                  <motion.div
                    key={`phrase-${step}`}
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 280 }}
                    className="relative flex flex-col items-center gap-6 rounded-3xl border border-white/15 bg-zinc-950/90 p-6 sm:p-9 text-center shadow-[0_0_60px_-15px_rgba(251,191,36,0.25)] backdrop-blur-2xl"
                  >
                    <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl pointer-events-none bg-amber-400/15" />

                    <div className="flex items-center gap-1.5 text-xs text-amber-300/80 font-medium">
                      <Sparkles className="h-3 w-3" />
                      <span>Constelación de flores amarillas</span>
                    </div>

                    <p className="text-lg sm:text-2xl font-light leading-relaxed text-white px-2">
                      “{content.phrases[step - 1]}”
                    </p>

                    <div className="flex w-full items-center justify-between pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 active:scale-95 transition-all"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Anterior</span>
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === totalSteps - 1 && (
                  <motion.div
                    key="final"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 280 }}
                    className="relative flex flex-col items-center gap-5 rounded-3xl border border-amber-400/40 bg-zinc-950/95 p-6 sm:p-8 text-center shadow-[0_0_70px_-15px_rgba(251,191,36,0.4)] backdrop-blur-2xl max-h-[88vh] overflow-y-auto no-scrollbar"
                  >
                    <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl pointer-events-none bg-amber-400/25" />

                    <AnimatedFlower size={60} />

                    <div className="space-y-2 px-1">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-amber-100">
                        {content.finalTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {content.finalMessage}
                      </p>
                    </div>

                    <div className="w-full pt-1">
                      <LeaveMessageForm prompt={content.formPrompt} />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Volver a leer</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 pointer-events-none">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step ? "w-6 bg-amber-400" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
