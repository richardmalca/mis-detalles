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
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: [star.color, "#ffffff", "#ffd700"],
      });
    }
  }, [star]);

  return (
    <AnimatePresence>
      {star && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            style={{
              boxShadow: `0 0 50px -10px ${star.glowColor}`,
            }}
          >
            <div
              className="absolute -right-20 -top-20 h-44 w-44 rounded-full blur-3xl"
              style={{ background: star.glowColor }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
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
                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      {star.date}
                    </span>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {star.title}
                </h3>
                <p className="text-sm font-medium text-amber-200/90 sm:text-base">
                  {star.summary}
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-zinc-200 sm:text-base leading-relaxed">
                <p className="font-light">{star.content}</p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                  <span>Estrella registrada en el cosmos</span>
                </div>

                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <Heart className="h-4 w-4 fill-white" />
                  Guardar en el corazón
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
