"use client";

import { useState, useEffect } from "react";
import { AnimatedFlower } from "./animated-flower";
import { supabase } from "@/lib/supabase";
import { ensureCreator, getStoredCreator, markCodeAsCreatedByMe } from "@/lib/creator";
import { ExperienceKind } from "@/lib/content";
import { getCurrentOccasion } from "@/lib/occasions";
import {
  Sparkles,
  Copy,
  Check,
  Heart,
  Users,
  ExternalLink,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Dices,
  PenLine,
} from "lucide-react";
import Link from "next/link";

const CUSTOM_FIELD_LIMIT = 200;

export function LinkGenerator() {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ExperienceKind>("amor");
  const [mode, setMode] = useState<"auto" | "custom">("auto");
  const [customMemory, setCustomMemory] = useState("");
  const [customFinal, setCustomFinal] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [creatorPin, setCreatorPin] = useState<string | null>(null);
  const [pinCopied, setPinCopied] = useState(false);

  useEffect(() => {
    const stored = getStoredCreator();
    if (stored) {
      setCreatorPin(stored.pin);
    }
  }, []);

  async function handleGenerate() {
    if (!name.trim()) return;
    setStatus("loading");
    setLink(null);

    try {
      const creator = await ensureCreator();
      if (!creator) {
        setStatus("error");
        return;
      }
      setCreatorPin(creator.pin);

      const occasion = getCurrentOccasion();

      const { data, error } = await supabase.rpc("create_love_link", {
        p_name: name.trim(),
        p_kind: kind,
        p_creator_id: creator.id,
        p_occasion_id: occasion.id,
        p_mode: mode,
        p_custom_memory: mode === "custom" ? customMemory.trim() : null,
        p_custom_final: mode === "custom" ? customFinal.trim() : null,
      });

      if (error || !data) {
        setStatus("error");
        return;
      }

      markCodeAsCreatedByMe(data as string);

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      setLink(`${origin}/experiencia/${data}`);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  async function handleCopyPin() {
    if (!creatorPin) return;
    await navigator.clipboard.writeText(creatorPin);
    setPinCopied(true);
    setTimeout(() => setPinCopied(false), 2500);
  }

  async function handleCopy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-white/10 bg-zinc-950/90 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl">
      <AnimatedFlower size={56} />

      <div className="flex w-full flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          ¿A quién dedicas este universo?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setLink(null);
          }}
          placeholder="Escribe un nombre..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-amber-400/70 focus:bg-white/[0.08]"
        />
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Tipo de dedicatoria
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setKind("amor")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
              kind === "amor"
                ? "border-pink-500/50 bg-pink-500/15 text-pink-300 shadow-md shadow-pink-500/10"
                : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20"
            }`}
          >
            <Heart className="h-3.5 w-3.5 fill-pink-400/20" />
            Amor romántico
          </button>

          <button
            type="button"
            onClick={() => setKind("amistad")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
              kind === "amistad"
                ? "border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-md shadow-amber-500/10"
                : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Amistad
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          ¿Cómo quieres la historia?
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("auto")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
              mode === "auto"
                ? "border-sky-500/50 bg-sky-500/15 text-sky-300 shadow-md shadow-sky-500/10"
                : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20"
            }`}
          >
            <Dices className="h-3.5 w-3.5" />
            Automático
          </button>

          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
              mode === "custom"
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-md shadow-emerald-500/10"
                : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20"
            }`}
          >
            <PenLine className="h-3.5 w-3.5" />
            Personalizado
          </button>
        </div>
      </div>

      {mode === "custom" && (
        <div className="flex w-full flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
          <p className="text-[11px] leading-relaxed text-zinc-400">
            Estos dos campos son opcionales, pero si los llenas, siempre van a
            aparecer en la historia (no se reemplazan al azar).
          </p>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Un recuerdo específico
              </label>
              <span className="text-[10px] text-zinc-500">
                {customMemory.length}/{CUSTOM_FIELD_LIMIT}
              </span>
            </div>
            <textarea
              value={customMemory}
              maxLength={CUSTOM_FIELD_LIMIT}
              onChange={(e) => setCustomMemory(e.target.value)}
              placeholder="Ej. Aquella tarde que nos quedamos hablando hasta tarde en el parque..."
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-400/60 focus:bg-white/[0.08]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Tu mensaje final
              </label>
              <span className="text-[10px] text-zinc-500">
                {customFinal.length}/{CUSTOM_FIELD_LIMIT}
              </span>
            </div>
            <textarea
              value={customFinal}
              maxLength={CUSTOM_FIELD_LIMIT}
              onChange={(e) => setCustomFinal(e.target.value)}
              placeholder="Ej. Gracias por ser mi persona favorita en este mundo..."
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-400/60 focus:bg-white/[0.08]"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={status === "loading" || !name.trim()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4" />
        {status === "loading" ? "Creando coordenadas..." : "Generar link único"}
      </button>

      {status === "error" && (
        <p className="text-xs text-rose-400 text-center">
          No se pudo conectar con el servicio. Verifica tu conexión e intenta de nuevo.
        </p>
      )}

      {link && (
        <div className="flex w-full flex-col gap-2.5 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">Link personalizado listo</span>
            <Link
              href={link}
              target="_blank"
              className="flex items-center gap-1 text-xs text-amber-200 underline hover:text-white"
            >
              Probar <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <p className="break-all text-xs font-mono text-zinc-200 bg-black/40 p-2.5 rounded-xl border border-white/5">
            {link}
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-400/20 border border-amber-400/40 py-2 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-400/30 active:scale-95"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "¡Enlace copiado!" : "Copiar enlace para enviar"}
          </button>
        </div>
      )}

      {creatorPin && (
        <div className="flex w-full flex-col gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300">
              <KeyRound className="h-3.5 w-3.5 text-violet-400" />
              <span>Tu PIN Maestro Personal</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-violet-300/80 bg-violet-500/20 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" /> Único para todos tus links
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-zinc-300">
            Este PIN es solo tuyo. No cambiará: todos los links que crees se agrupan bajo este mismo PIN.
          </p>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5">
            <span className="font-mono text-base sm:text-lg font-extrabold tracking-[0.25em] text-white">
              {creatorPin}
            </span>
            <button
              onClick={handleCopyPin}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-violet-200 transition-colors hover:bg-white/20 active:scale-95"
            >
              {pinCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {pinCopied ? "Copiado" : "Copiar PIN"}
            </button>
          </div>

          <Link
            href={`/mi-panel?pin=${creatorPin}`}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-500/20 py-2 text-xs font-semibold text-violet-200 transition-all hover:bg-violet-500/30 hover:text-white"
          >
            <span>Ver mis links en mi panel</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
