"use client";

import { Constellation, MemoryStar } from "@/types/galaxy";
import { Sparkles, Compass } from "lucide-react";

interface ConstellationHudProps {
  constellations: Constellation[];
  memoryStars: MemoryStar[];
  activeConstellationId: string | null;
  discoveredStars?: string[];
  onSelectConstellation: (id: string | null) => void;
  onSelectStar: (star: MemoryStar) => void;
}

export function ConstellationHud({
  constellations,
  memoryStars,
  activeConstellationId,
  discoveredStars = [],
  onSelectConstellation,
  onSelectStar,
}: ConstellationHudProps) {
  return (
    <div className="absolute left-4 top-24 z-20 hidden md:block max-w-xs pointer-events-auto">
      <div className="rounded-2xl border border-white/10 bg-zinc-950/75 p-4 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Compass className="h-4 w-4 text-violet-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Constelaciones
          </h2>
        </div>

        <div className="mt-3 space-y-2">
          {constellations.map((c) => {
            const isActive = activeConstellationId === c.id;
            const stars = memoryStars.filter((s) => c.stars.includes(s.id));
            const discoveredInThis = stars.filter((s) => discoveredStars.includes(s.id)).length;
            const isCompleted = discoveredInThis === stars.length && stars.length > 0;

            return (
              <div
                key={c.id}
                className={`rounded-xl border p-2.5 transition-all cursor-pointer ${
                  isActive
                    ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                    : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
                onClick={() => onSelectConstellation(isActive ? null : c.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-100">{c.name}</span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400">
                      {discoveredInThis}/{stars.length}
                    </span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: c.accentColor }}
                    />
                  </div>
                </div>
                <p className="mt-1 text-[11px] italic text-zinc-400">{c.latinName}</p>

                {isActive && (
                  <div className="mt-2.5 space-y-1 border-t border-white/10 pt-2">
                    <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
                      {c.meaning}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {stars.map((s) => {
                        const isDiscovered = discoveredStars.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStar(s);
                            }}
                            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] transition-colors ${
                              isDiscovered
                                ? "bg-amber-400/20 text-amber-200 border border-amber-400/40"
                                : "bg-white/10 text-zinc-300 hover:bg-white/20"
                            }`}
                          >
                            <Sparkles className={`h-2.5 w-2.5 ${isDiscovered ? "text-amber-300 fill-amber-300" : "text-zinc-400"}`} />
                            {s.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
