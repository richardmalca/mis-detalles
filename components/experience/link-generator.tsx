"use client";

import { useState } from "react";
import { AnimatedFlower } from "./animated-flower";
import { supabase } from "@/lib/supabase";
import { ensureCreator } from "@/lib/creator";
import { ExperienceKind } from "@/lib/content";
import { Sparkles, Copy, Check, Heart, Users, ExternalLink, KeyRound } from "lucide-react";
import Link from "next/link";

export function LinkGenerator() {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ExperienceKind>("amor");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [myPin, setMyPin] = useState<string | null>(null);
  const [pinCopied, setPinCopied] = useState(false);

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
      setMyPin(creator.pin);

      const { data, error } = await supabase.rpc("create_love_link", {
        p_name: name.trim(),
        p_kind: kind,
        p_creator_id: creator.id,
      });

      if (error || !data) {
        setStatus("error");
        return;
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      setLink(`${origin}/experiencia/${data}`);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  async function handleCopyPin() {
    if (!myPin) return;
    await navigator.clipboard.writeText(myPin);
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
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
      <AnimatedFlower size={64} />

      <div className="flex w-full flex-col gap-2">
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
          placeholder="Ej. Sofía, Carlos, Mi Amor..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-amber-400/60 focus:bg-white/[0.08]"
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Tipo de dedicatoria
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setKind("amor")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
              kind === "amor"
                ? "border-pink-500/50 bg-pink-500/10 text-pink-300 shadow-lg shadow-pink-500/10"
                : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20"
            }`}
          >
            <Heart className="h-4 w-4 fill-pink-400/20" />
            Amor romántico
          </button>

          <button
            type="button"
            onClick={() => setKind("amistad")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
              kind === "amistad"
                ? "border-amber-500/50 bg-amber-500/10 text-amber-300 shadow-lg shadow-amber-500/10"
                : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20"
            }`}
          >
            <Users className="h-4 w-4" />
            Amistad
          </button>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={status === "loading" || !name.trim()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4" />
        {status === "loading" ? "Creando coordenadas..." : "Generar link único"}
      </button>

      {status === "error" && (
        <p className="text-xs text-rose-400 text-center">
          No se pudo conectar con el servicio de guardado. Verifica la configuración de Supabase.
        </p>
      )}

      {link && (
        <div className="flex w-full flex-col gap-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">Tu universo está listo</span>
            <Link
              href={link}
              target="_blank"
              className="flex items-center gap-1 text-xs text-amber-200 underline hover:text-white"
            >
              Visitar <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <p className="break-all text-xs font-mono text-zinc-200">{link}</p>
          <button
            onClick={handleCopy}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-white/15 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/25"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "¡Copiado al portapapeles!" : "Copiar enlace"}
          </button>
        </div>
      )}

      {myPin && (
        <div className="flex w-full flex-col gap-2 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <KeyRound className="h-3.5 w-3.5" />
            Tu PIN para ver tus links
          </div>
          <p className="text-xs text-zinc-300">
            Guárdalo: con este PIN entras a <span className="font-semibold text-white">Mi panel</span> y ves
            solo los links que tú generaste, nadie más.
          </p>
          <div className="flex items-center justify-between rounded-xl bg-black/40 px-4 py-2">
            <span className="font-mono text-lg tracking-[0.3em] text-white">{myPin}</span>
            <button
              onClick={handleCopyPin}
              className="flex items-center gap-1 text-xs text-indigo-200 hover:text-white"
            >
              {pinCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {pinCopied ? "Copiado" : "Copiar"}
            </button>
          </div>
          <Link
            href="/mi-panel"
            className="mt-1 text-center text-xs text-indigo-200 underline hover:text-white"
          >
            Ir a Mi panel
          </Link>
        </div>
      )}
    </div>
  );
}
