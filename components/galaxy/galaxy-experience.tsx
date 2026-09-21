"use client";

import { useRef } from "react";
import { useGalaxyCanvas } from "@/hooks/use-galaxy-canvas";
import { MEMORY_STARS, CONSTELLATIONS } from "@/data/memories";
import { StarDetailModal } from "./star-detail-modal";
import { ConstellationHud } from "./constellation-hud";
import { UniverseControls } from "./universe-controls";
import { Heart, MousePointerClick, Move3d } from "lucide-react";

export function GalaxyExperience() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const {
    canvasRef,
    selectedStar,
    setSelectedStar,
    activeConstellationId,
    setActiveConstellationId,
    isDragging,
    isAudioPlaying,
    setIsAudioPlaying,
    discoveredStars,
    focusStar,
    resetView,
    zoomIn,
    zoomOut,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useGalaxyCanvas();

  const toggleCosmicAudio = () => {
    if (isAudioPlaying) {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.5);
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current?.disconnect();
          audioContextRef.current?.close();
          audioContextRef.current = null;
        }, 500);
      }
      setIsAudioPlaying(false);
    } else {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(108, ctx.currentTime);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(216, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 3);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc2.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black font-sans select-none">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 block h-full w-full ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      />

      <header className="absolute left-6 top-6 z-20 pointer-events-auto flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-zinc-950/80 shadow-2xl backdrop-blur-xl">
          <Heart className="h-5 w-5 text-pink-400 fill-pink-500/20" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl drop-shadow-md">
            Mis Detalles
          </h1>
          <p className="text-xs font-medium text-zinc-300">
            Nuestro cosmos de recuerdos compartidos
          </p>
        </div>
      </header>

      <div className="absolute top-6 right-6 z-20 hidden lg:flex items-center gap-4 pointer-events-none text-xs text-zinc-300 rounded-full border border-white/10 bg-zinc-950/60 px-4 py-2 backdrop-blur-md">
        <span className="flex items-center gap-1.5">
          <Move3d className="h-3.5 w-3.5 text-zinc-400" /> Arrastra para rotar en 3D
        </span>
        <span className="h-3 w-[1px] bg-white/10" />
        <span className="flex items-center gap-1.5">
          <MousePointerClick className="h-3.5 w-3.5 text-amber-300" /> Clic en las estrellas para leer
        </span>
      </div>

      <ConstellationHud
        constellations={CONSTELLATIONS}
        memoryStars={MEMORY_STARS}
        activeConstellationId={activeConstellationId}
        onSelectConstellation={setActiveConstellationId}
        onSelectStar={focusStar}
      />

      <UniverseControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleCosmicAudio}
        discoveredCount={discoveredStars.length}
        totalCount={MEMORY_STARS.length}
      />

      <StarDetailModal star={selectedStar} onClose={() => setSelectedStar(null)} />
    </div>
  );
}
