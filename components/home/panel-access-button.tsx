"use client";

import { useState } from "react";
import { Lock, X } from "lucide-react";

export function PanelAccessButton() {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/panel-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (!res.ok) {
      setError(true);
      setLoading(false);
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/70 px-3 py-2 text-[11px] font-medium text-zinc-400 backdrop-blur-xl transition-colors hover:border-white/25 hover:text-zinc-200"
        aria-label="Acceso al panel privado"
      >
        <Lock className="h-3 w-3" />
        <span>Panel</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-xs rounded-2xl border border-white/10 bg-zinc-950 p-6"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="mb-3 text-sm font-semibold text-white">
              Acceso privado
            </p>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="PIN"
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-amber-400/60"
            />
            {error && (
              <p className="mt-2 text-xs text-red-400">PIN incorrecto.</p>
            )}
            <button
              type="submit"
              disabled={loading || !pin}
              className="mt-4 w-full rounded-lg bg-amber-400 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-300 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
