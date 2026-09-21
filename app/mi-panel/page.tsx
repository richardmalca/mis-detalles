"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getStoredCreator } from "@/lib/creator";
import { KeyRound } from "lucide-react";

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

export default function MiPanelPage() {
  const [pin, setPin] = useState("");
  const [rows, setRows] = useState<LinkRow[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    const stored = getStoredCreator();
    if (stored) {
      setPin(stored.pin);
      fetchLinks(stored.pin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchLinks(p: string) {
    setStatus("loading");
    const { data, error } = await supabase.rpc("get_my_links", { p_pin: p });
    if (error) {
      setStatus("error");
      return;
    }
    setRows((data ?? []) as LinkRow[]);
    setStatus("idle");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim()) fetchLinks(pin.trim());
  }

  return (
    <main className="min-h-screen bg-[#04010c] px-4 py-10 text-zinc-100 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-bold text-amber-200">Mi panel</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Ingresa el PIN que recibiste al generar tu primer link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-8 flex max-w-sm items-center gap-2"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <KeyRound className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Tu PIN"
              className="w-full bg-transparent text-sm text-white outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-300"
          >
            Ver
          </button>
        </form>

        {status === "error" && (
          <p className="text-sm text-red-400">Algo salió mal, intenta de nuevo.</p>
        )}

        {rows && rows.length === 0 && status === "idle" && (
          <p className="text-sm text-zinc-500">
            No encontramos links con ese PIN, o todavía no has creado ninguno.
          </p>
        )}

        {rows && rows.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Creado</th>
                  <th className="px-4 py-3">Abierto</th>
                  <th className="px-4 py-3">Completó</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.code} className="border-t border-white/5">
                    <td className="px-4 py-3 font-medium text-white">
                      {row.recipient_name}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {row.kind === "amistad" ? "🌻 Amistad" : "💛 Amor"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {row.opened_at ? (
                        <span className="text-emerald-400">
                          ✓ {formatDate(row.opened_at)}
                        </span>
                      ) : (
                        <span className="text-zinc-600">Sin abrir</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.completed_at ? (
                        <span className="text-emerald-400">✓</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
