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
  const chimeIntervalRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

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
    closeModal,
    resetView,
    zoomIn,
    zoomOut,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useGalaxyCanvas({ enablePinchZoom: true });

  const playHarmonicChime = (ctx: AudioContext, gainNode: GainNode) => {
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

    osc.connect(noteGain);
    noteGain.connect(gainNode);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 3.0);
  };

  const toggleCosmicAudio = () => {
    if (isAudioPlaying) {
      if (chimeIntervalRef.current) {
        clearInterval(chimeIntervalRef.current);
        chimeIntervalRef.current = null;
      }
      if (masterGainRef.current && audioContextRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.4);
        setTimeout(() => {
          audioContextRef.current?.close();
          audioContextRef.current = null;
          masterGainRef.current = null;
        }, 450);
      }
      setIsAudioPlaying(false);
    } else {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.85, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      playHarmonicChime(ctx, masterGain);
      setTimeout(() => {
        if (audioContextRef.current && masterGainRef.current) {
          playHarmonicChime(audioContextRef.current, masterGainRef.current);
        }
      }, 700);

      chimeIntervalRef.current = window.setInterval(() => {
        if (audioContextRef.current && masterGainRef.current) {
          playHarmonicChime(audioContextRef.current, masterGainRef.current);
        }
      }, 2400);

      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-black font-sans select-none">
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

      <header className="absolute left-4 top-4 sm:left-6 sm:top-6 z-20 pointer-events-auto flex items-center gap-2.5 pt-[env(safe-area-inset-top)]">
        <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-white/15 bg-zinc-950/80 shadow-2xl backdrop-blur-xl">
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-400 fill-pink-500/20" />
        </div>
        <div>
          <h1 className="text-base sm:text-xl font-bold tracking-tight text-white drop-shadow-md">
            Mis Detalles
          </h1>
          <p className="text-[10px] sm:text-xs font-medium text-zinc-400">
            Cosmos de recuerdos compartidos
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
        discoveredStars={discoveredStars}
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

      <StarDetailModal star={selectedStar} onClose={closeModal} />
    </div>
  );
}
