"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useCosmicAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeIntervalRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const playHarmonicChime = useCallback((ctx: AudioContext, gainNode: GainNode) => {
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
  }, []);

  const start = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
      setIsPlaying(true);
      return;
    }
    if (audioCtxRef.current) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.75, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      const warmPad = ctx.createOscillator();
      const padGain = ctx.createGain();
      warmPad.type = "triangle";
      warmPad.frequency.setValueAtTime(220, ctx.currentTime);
      padGain.gain.setValueAtTime(0.012, ctx.currentTime);
      warmPad.connect(padGain);
      padGain.connect(masterGain);
      warmPad.start();

      playHarmonicChime(ctx, masterGain);
      setTimeout(() => {
        if (audioCtxRef.current) playHarmonicChime(ctx, masterGain);
      }, 700);

      chimeIntervalRef.current = window.setInterval(() => {
        if (audioCtxRef.current && masterGainRef.current) {
          playHarmonicChime(ctx, masterGainRef.current);
        }
      }, 2200);

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
      masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.35);
      setTimeout(() => {
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        masterGainRef.current = null;
      }, 400);
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
    return () => {
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
