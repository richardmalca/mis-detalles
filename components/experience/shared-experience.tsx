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
    startAudio();
    setOpened(true);
    setIsAutoPlaying(true);
    supabase.rpc("mark_link_opened", { p_code: code }).then(() => {});
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffd700", "#ffffff", "#f59e0b", "#fef08a"],
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
    }, 4800);

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

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.65)_100%)]" />

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
                  ? "border-amber-400/70 bg-amber-400/25 text-amber-200 shadow-amber-500/20"
                  : "border-white/15 bg-zinc-950/70 text-zinc-300 hover:text-white"
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <span className="text-[11px] sm:text-xs">Pausar</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span className="text-[11px] sm:text-xs">Automático</span>
                </>
              )}
            </button>

            <button
              onClick={toggleAudio}
              className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl shadow-lg transition-all active:scale-95 ${
                isAudioPlaying
                  ? "border-amber-400/40 bg-zinc-950/80 text-amber-300"
                  : "border-white/15 bg-zinc-950/70 text-zinc-400 hover:text-white"
              }`}
            >
              {isAudioPlaying ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="absolute top-4 left-4 z-40 flex items-center gap-2 pointer-events-none">
            <span className="rounded-full border border-amber-400/20 bg-zinc-950/70 px-3 py-1 text-[11px] font-semibold text-amber-200 backdrop-blur-md">
              {step + 1} / {totalSteps}
            </span>
          </div>

          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <div className="w-full max-w-lg pointer-events-auto">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -30 }}
                    transition={{ type: "spring", damping: 22, stiffness: 220 }}
                    className="relative flex flex-col items-center gap-4 text-center px-4 py-8"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <AnimatedFlower size={64} />
                    </motion.div>

                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md"
                    >
                      <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
                      {content.badge}
                    </motion.span>

                    <motion.h1
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(251,191,36,0.45)]"
                    >
                      {recipientName}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="max-w-md text-base sm:text-lg font-light leading-relaxed text-amber-50/90 drop-shadow"
                    >
                      {content.intro}
                    </motion.p>

                    <motion.button
                      type="button"
                      onClick={goNext}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 px-8 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all"
                    >
                      <span>Descubrir mensaje</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                )}

                {step > 0 && step <= content.phrases.length && (
                  <motion.div
                    key={`phrase-${step}`}
                    initial={{ opacity: 0, scale: 0.88, y: 35, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, y: -35, filter: "blur(8px)" }}
                    transition={{ type: "spring", damping: 24, stiffness: 200 }}
                    className="relative flex flex-col items-center gap-6 text-center px-4 py-8"
                  >
                    <motion.div
                      animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <AnimatedFlower size={46} delay={step * 0.15} />
                    </motion.div>

                    <div className="relative max-w-xl px-2 flex flex-col items-center gap-3">
                      {content.phrases[step - 1].startsWith("Capítulo") ? (
                        <>
                          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-amber-300/90 drop-shadow">
                            {content.phrases[step - 1].split(":")[0]}
                          </span>
                          <p className="text-xl sm:text-3xl md:text-4xl font-light leading-relaxed text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] tracking-wide">
                            {content.phrases[step - 1].split(":").slice(1).join(":").trim()}
                          </p>
                        </>
                      ) : (
                        <p className="text-xl sm:text-3xl md:text-4xl font-light leading-relaxed text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] tracking-wide">
                          “{content.phrases[step - 1]}”
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-zinc-950/60 backdrop-blur-lg px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/15 active:scale-95 transition-all shadow-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Anterior</span>
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-2 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all"
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
                    initial={{ opacity: 0, scale: 0.92, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -25 }}
                    transition={{ type: "spring", damping: 22, stiffness: 220 }}
                    className="relative flex flex-col items-center gap-5 rounded-3xl border border-amber-400/35 bg-zinc-950/80 p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(251,191,36,0.3)] backdrop-blur-2xl max-h-[88vh] overflow-y-auto no-scrollbar"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl pointer-events-none bg-amber-400/25" />

                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <AnimatedFlower size={64} />
                    </motion.div>

                    <div className="space-y-2 px-1">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-200 drop-shadow">
                        {content.finalTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-sm mx-auto">
                        {content.finalMessage}
                      </p>
                    </div>

                    <div className="w-full pt-1">
                      <LeaveMessageForm prompt={content.formPrompt} />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(0);
                          setIsAutoPlaying(true);
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition-colors"
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
                  idx === step ? "w-7 bg-amber-400 shadow-[0_0_8px_#fbbf24]" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
