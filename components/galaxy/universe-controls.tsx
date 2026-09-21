"use client";

import { ZoomIn, ZoomOut, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";

interface UniverseControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  discoveredCount: number;
  totalCount: number;
}

export function UniverseControls({
  onZoomIn,
  onZoomOut,
  onReset,
  isAudioPlaying,
  onToggleAudio,
  discoveredCount,
  totalCount,
}: UniverseControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3 pointer-events-auto">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/80 px-3.5 py-2 text-xs font-medium text-zinc-300 backdrop-blur-xl shadow-xl">
        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        <span>
          Estrellas exploradas:{" "}
          <strong className="text-white">
            {discoveredCount}/{totalCount}
          </strong>
        </span>
      </div>

      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-zinc-950/80 p-1.5 backdrop-blur-xl shadow-xl">
        <button
          onClick={onZoomIn}
          className="rounded-xl p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          title="Acercar"
          aria-label="Acercar vista"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <button
          onClick={onZoomOut}
          className="rounded-xl p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          title="Alejar"
          aria-label="Alejar vista"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-[1px] bg-white/10" />

        <button
          onClick={onReset}
          className="rounded-xl p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          title="Reiniciar vista"
          aria-label="Reiniciar vista"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={onToggleAudio}
          className={`rounded-xl p-2 transition-colors ${
            isAudioPlaying
              ? "bg-violet-600/30 text-violet-300 hover:bg-violet-600/40"
              : "text-zinc-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Ambiente sonoro"
          aria-label="Alternar audio cósmico"
        >
          {isAudioPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
