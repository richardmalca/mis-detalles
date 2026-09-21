"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getStoredCreator, saveStoredCreator } from "@/lib/creator";
import {
  KeyRound,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  Lock,
  Heart,
  Eye,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface LinkRow {
  code: string;
  recipient_name: string;
  kind: string;
  created_at: string;
  opened_at: string | null;
  completed_at: string | null;
  open_count: number;
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PanelContent() {
  const searchParams = useSearchParams();
  const [pin, setPin] = useState("");
  const [rows, setRows] = useState<LinkRow[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const pinParam = searchParams.get("pin");
    const stored = getStoredCreator();
    const initialPin = pinParam || stored?.pin || "";

    if (initialPin) {
      setPin(initialPin);
      fetchLinks(initialPin);
    }
  }, [searchParams]);

  async function fetchLinks(inputPin: string) {
    if (!inputPin.trim()) return;
    setStatus("loading");

    const { data, error } = await supabase.rpc("get_my_links", {
      p_pin: inputPin.trim(),
    });

    if (error) {
      setStatus("error");
      setAuthenticated(false);
      return;
    }

    const fetchedRows = (data ?? []) as LinkRow[];
    setRows(fetchedRows);
    setStatus("idle");
    setAuthenticated(true);

    const currentStored = getStoredCreator();
    if (currentStored) {
      saveStoredCreator(currentStored.id, inputPin.trim());
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim()) {
      fetchLinks(pin.trim());
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-300">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Mi Panel de Universos
            </h1>
            <p className="text-xs text-zinc-400">
              Seguimiento en tiempo real de los links que has compartido
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver</span>
        </Link>
      </div>

      {!authenticated ? (
        <div className="mx-auto max-w-sm rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-5">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-violet-500/30 bg-violet-500/15 text-violet-300 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              <Lock className="h-6 w-6" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Acceso con PIN</h2>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Ingresa el PIN de 6 dígitos que recibiste al crear tus enlaces para ver el estado de cada uno.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa tu PIN"
                className="w-full rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-lg font-mono tracking-[0.25em] text-white outline-none focus:border-violet-400 focus:bg-white/[0.08]"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !pin.trim()}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {status === "loading" ? "Verificando..." : "Ingresar a mi panel"}
            </button>

            {status === "error" && (
              <p className="text-xs text-rose-400 pt-1">
                No pudimos verificar el PIN o hubo un problema de conexión.
              </p>
            )}
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <span className="text-zinc-500">Sesión activa con PIN:</span>
              <span className="font-mono font-bold text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-lg border border-violet-500/30">
                {pin}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-xl bg-amber-400/20 border border-amber-400/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-400/30"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Crear otro universo</span>
              </Link>
              <button
                onClick={() => {
                  setAuthenticated(false);
                  setRows(null);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                Cambiar PIN
              </button>
            </div>
          </div>

          {rows && rows.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-8 text-center space-y-3">
              <Heart className="mx-auto h-8 w-8 text-zinc-600" />
              <p className="text-sm text-zinc-300">
                Todavía no has creado universos con este PIN.
              </p>
              <Link
                href="/"
                className="inline-block rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-300"
              >
                Generar mi primer link
              </Link>
            </div>
          )}

          {rows && rows.length > 0 && (
            <div className="grid gap-3 sm:gap-4">
              {rows.map((row) => {
                const fullUrl = `${origin}/experiencia/${row.code}`;

                return (
                  <div
                    key={row.code}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-white/20"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-white">
                          {row.recipient_name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            row.kind === "amor"
                              ? "border-pink-500/30 bg-pink-500/10 text-pink-300"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {row.kind === "amor" ? "💛 Amor" : "🌻 Amistad"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {row.opened_at ? (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            <span>Visto {row.open_count > 1 ? `(${row.open_count} veces)` : ""}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-[11px] text-zinc-400">
                            <Clock className="h-3 w-3" />
                            <span>Sin abrir</span>
                          </span>
                        )}

                        {row.completed_at && (
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                            Leyó todo ✨
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.03] p-2.5 text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-400 font-mono">
                        <span className="truncate max-w-[200px] sm:max-w-md">{fullUrl}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/experiencia/${row.code}`}
                          target="_blank"
                          className="flex items-center gap-1 text-violet-300 hover:text-white underline"
                        >
                          <span>Ver</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Creado: {formatDate(row.created_at)}
                      </span>
                      {row.opened_at && (
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Eye className="h-3 w-3 text-emerald-400" /> Última apertura: {formatDate(row.opened_at)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MiPanelPage() {
  return (
    <main className="min-h-screen bg-[#04010c] px-4 py-8 sm:py-12 text-zinc-100 selection:bg-violet-500/30">
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-zinc-400">
            Cargando panel...
          </div>
        }
      >
        <PanelContent />
      </Suspense>
    </main>
  );
}
