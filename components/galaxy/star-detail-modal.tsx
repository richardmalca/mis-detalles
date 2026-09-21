"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Calendar, Heart, BookmarkCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { MemoryStar } from "@/types/galaxy";

interface StarDetailModalProps {
  star: MemoryStar | null;
  onClose: () => void;
}

export function StarDetailModal({ star, onClose }: StarDetailModalProps) {
  useEffect(() => {
    if (star) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: [star.color, "#ffffff", "#ffd700"],
      });
    }
  }, [star]);

  return (
    <AnimatePresence>
      {star && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 select-none pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-white/15 bg-zinc-950/95 p-5 sm:p-7 shadow-2xl backdrop-blur-xl"
            style={{
              boxShadow: `0 0 50px -10px ${star.glowColor}`,
            }}
          >
            <div
              className="absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl pointer-events-none"
              style={{ background: star.glowColor }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
                    style={{
                      borderColor: `${star.color}66`,
                      backgroundColor: `${star.color}1a`,
                      color: star.color,
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                    {star.tag}
                  </span>
                  {star.date && (
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      {star.date}
                    </span>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {star.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-amber-200/90">
                  {star.summary}
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 text-sm sm:text-base leading-relaxed text-zinc-200">
                <p className="font-light">{star.content}</p>
              </div>

              <div className="mt-5 flex items-center justify-between pt-1 gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <BookmarkCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden xs:inline">Guardado en el cosmos</span>
                </div>

                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <Heart className="h-3.5 w-3.5 fill-white" />
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
