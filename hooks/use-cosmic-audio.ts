"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const AUDIO_PREF_KEY = "mdt_audio_enabled";

export function useCosmicAudio(options?: { storageKey?: string; autoStartIfSaved?: boolean }) {
  const storageKey = options?.storageKey || AUDIO_PREF_KEY;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeIntervalRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const userWantsAudioRef = useRef<boolean>(false);
  const wasPlayingBeforeHiddenRef = useRef<boolean>(false);

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
      noteGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(gainNode);

      osc.start(ctx.currentTime);
      oscHarmonic.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.6);
      oscHarmonic.stop(ctx.currentTime + 2.6);
    } catch {}
  }, []);

  const internalStart = useCallback(() => {
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
        masterGain.gain.setValueAtTime(0.85, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        playHarmonicChime(ctx, masterGain);

        setTimeout(() => {
          if (audioCtxRef.current && masterGainRef.current) {
            playHarmonicChime(audioCtxRef.current, masterGainRef.current);
          }
        }, 500);

        chimeIntervalRef.current = window.setInterval(() => {
          if (audioCtxRef.current && masterGainRef.current) {
            if (audioCtxRef.current.state === "suspended") {
              audioCtxRef.current.resume();
            }
            playHarmonicChime(audioCtxRef.current, masterGainRef.current);
          }
        }, 2200);
      } else {
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.setValueAtTime(0.85, ctx.currentTime);
      }

      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [playHarmonicChime]);

  const internalStop = useCallback(() => {
    if (chimeIntervalRef.current) {
      clearInterval(chimeIntervalRef.current);
      chimeIntervalRef.current = null;
    }
    if (masterGainRef.current && audioCtxRef.current) {
      try {
        masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        masterGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        audioCtxRef.current.close().catch(() => {});
      } catch {}
      audioCtxRef.current = null;
      masterGainRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const start = useCallback(() => {
    userWantsAudioRef.current = true;
    try {
      window.localStorage.setItem(storageKey, "true");
    } catch {}
    internalStart();
  }, [storageKey, internalStart]);

  const stop = useCallback(() => {
    userWantsAudioRef.current = false;
    try {
      window.localStorage.setItem(storageKey, "false");
    } catch {}
    internalStop();
  }, [storageKey, internalStop]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "true") {
        userWantsAudioRef.current = true;
        if (options?.autoStartIfSaved) {
          internalStart();
        }
      }
    } catch {}
  }, [storageKey, options?.autoStartIfSaved, internalStart]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (userWantsAudioRef.current && audioCtxRef.current) {
          wasPlayingBeforeHiddenRef.current = true;
          audioCtxRef.current.suspend().catch(() => {});
          setIsPlaying(false);
        }
      } else {
        if (wasPlayingBeforeHiddenRef.current && userWantsAudioRef.current) {
          wasPlayingBeforeHiddenRef.current = false;
          if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            internalStart();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleUserGesture = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().then(() => {
          if (userWantsAudioRef.current) setIsPlaying(true);
        }).catch(() => {});
      } else if (userWantsAudioRef.current && !masterGainRef.current) {
        internalStart();
      }
    };

    window.addEventListener("pointerdown", handleUserGesture, { passive: true });
    window.addEventListener("touchstart", handleUserGesture, { passive: true });
    window.addEventListener("touchend", handleUserGesture, { passive: true });
    window.addEventListener("click", handleUserGesture, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointerdown", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
      window.removeEventListener("touchend", handleUserGesture);
      window.removeEventListener("click", handleUserGesture);

      if (chimeIntervalRef.current) {
        clearInterval(chimeIntervalRef.current);
        chimeIntervalRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        masterGainRef.current = null;
      }
    };
  }, [internalStart]);

  return { isPlaying, start, stop, toggle };
}
