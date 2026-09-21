"use client";

import { AnimatedFlower } from "./animated-flower";
import { Sparkles, Heart } from "lucide-react";

interface OpeningCardProps {
  recipientName: string;
  onOpen: () => void;
}

export function OpeningCard({ recipientName, onOpen }: OpeningCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 p-6 backdrop-blur-xl select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.18),transparent_70%)]" />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-amber-400/30 bg-zinc-900/90 p-8 text-center shadow-[0_0_60px_-15px_rgba(251,191,36,0.3)]">
        <div className="absolute -top-7 left-1/2 -translate-x-1/2">
          <AnimatedFlower size={68} />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold tracking-widest text-amber-300 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Especialmente para ti
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow">
            {recipientName.trim() || "Ti"}
          </h1>
        </div>

        <p className="text-sm leading-relaxed text-zinc-300">
          Hay un cosmos entero de recuerdos, flores amarillas y palabras preparadas para ti.
        </p>

        <button
          type="button"
          onClick={onOpen}
          className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95"
        >
          <Heart className="h-4 w-4 fill-zinc-950" />
          Descubrir universo
        </button>

        <div className="absolute -bottom-4 flex gap-2">
          <AnimatedFlower size={34} delay={0.2} swayDuration={3.8} />
          <AnimatedFlower size={34} delay={0.4} swayDuration={4.2} />
        </div>
      </div>
    </div>
  );
}
