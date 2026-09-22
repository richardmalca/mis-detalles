"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useCosmicAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeIntervalRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const playHarmonicChime = useCallback((ctx: AudioContext, gainNode: GainNode) => {
    try {
      const melody = [
        261.63,
        293.66,
        329.63,
        349.23,
        392.0,
        440.0,
        493.88,
        523.25,
        587.33,
        659.25,
      ];
      const freq = melody[Math.floor(Math.random() * melody.length)];

      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.6);

      osc.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(gainNode);

      osc.start(ctx.currentTime);
      oscHarmonic.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.7);
      oscHarmonic.stop(ctx.currentTime + 2.7);
    } catch {}
  }, []);

  const start = useCallback(() => {
    try {
      let ctx = audioCtxRef.current;
      if (!ctx || ctx.state === "closed") {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        ctx = new AudioCtx();
        audioCtxRef.current = ctx;
      }

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      if (!masterGainRef.current) {
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.7, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        playHarmonicChime(ctx, masterGain);

        setTimeout(() => {
          if (audioCtxRef.current && masterGainRef.current) {
            playHarmonicChime(audioCtxRef.current, masterGainRef.current);
          }
        }, 700);

        chimeIntervalRef.current = window.setInterval(() => {
          if (audioCtxRef.current && masterGainRef.current) {
            if (audioCtxRef.current.state === "suspended") {
              audioCtxRef.current.resume();
            }
            playHarmonicChime(audioCtxRef.current, masterGainRef.current);
          }
        }, 2400);
      }

      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [playHarmonicChime]);

  const stop = useCallback(() => {
    if (chimeIntervalRef.current) {
      clearInterval(chimeIntervalRef.current);
      chimeIntervalRef.current = null;
    }
    if (masterGainRef.current && audioCtxRef.current) {
      try {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.25);
        setTimeout(() => {
          audioCtxRef.current?.close().catch(() => {});
          audioCtxRef.current = null;
          masterGainRef.current = null;
        }, 300);
      } catch {}
    }
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  useEffect(() => {
    const handleFirstTouch = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener("touchstart", handleFirstTouch, { passive: true });
    window.addEventListener("touchend", handleFirstTouch, { passive: true });
    window.addEventListener("click", handleFirstTouch, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstTouch);
      window.removeEventListener("touchend", handleFirstTouch);
      window.removeEventListener("click", handleFirstTouch);
      if (chimeIntervalRef.current) {
        clearInterval(chimeIntervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return { isPlaying, start, stop, toggle };
}
