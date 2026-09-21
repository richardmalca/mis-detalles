"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export function LeaveMessageForm({ prompt }: { prompt: string }) {
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");

    try {
      const { error } = await supabase
        .from("love_messages")
        .insert({ message: message.trim(), sender_name: senderName.trim() || null });

      if (error) {
        setStatus("error");
        return;
      }
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/80 p-4 text-emerald-200 backdrop-blur-md">
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        <p className="text-sm font-medium">Enviado con cariño ✨</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-white/15 bg-zinc-950/85 p-5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-left"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
        {prompt}
      </p>

      <input
        type="text"
        value={senderName}
        onChange={(e) => setSenderName(e.target.value)}
        placeholder="Tu nombre (opcional)"
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-amber-400/70 focus:bg-white/[0.07]"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-amber-400/70 focus:bg-white/[0.07] resize-none"
      />

      <button
        type="submit"
        disabled={status === "sending" || !message.trim()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-sm font-bold text-zinc-950 shadow-md transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Enviando..." : "Enviar dedicatoria"}
      </button>

      {status === "error" && (
        <div className="flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>No pudimos guardar el mensaje ahora. Inténtalo luego.</span>
        </div>
      )}
    </form>
  );
}
