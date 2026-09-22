"use client";

import { useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
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

export function MasterLinksTable({
  initialLinks,
  secretKey,
}: {
  initialLinks: LinkRow[];
  secretKey: string;
}) {
  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  async function handleDelete(code: string, name: string) {
    if (!window.confirm(`¿Eliminar link de "${name}"?`)) return;

    setDeletingCode(code);
    try {
      const res = await fetch("/api/delete-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, secret: secretKey }),
      });

      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.code !== code));
      } else {
        alert("No se pudo eliminar el link");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setDeletingCode(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-400">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Creado</th>
            <th className="px-4 py-3">Abierto</th>
            <th className="px-4 py-3">Completó</th>
            <th className="px-4 py-3">Visitas</th>
            <th className="px-4 py-3 text-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          {links.map((row) => (
            <tr key={row.code} className="border-t border-white/5 hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-medium text-white">
                <div className="flex items-center gap-2">
                  <span>{row.recipient_name}</span>
                  <Link
                    href={`/experiencia/${row.code}`}
                    target="_blank"
                    className="text-zinc-500 hover:text-amber-300"
                    title="Ver experiencia"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
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
                  <span className="text-emerald-400">
                    ✓ {formatDate(row.completed_at)}
                  </span>
                ) : (
                  <span className="text-zinc-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-zinc-400">
                {row.open_count}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  disabled={deletingCode === row.code}
                  onClick={() => handleDelete(row.code, row.recipient_name)}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/20 disabled:opacity-40 transition-colors"
                  title="Eliminar link"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>{deletingCode === row.code ? "..." : "Borrar"}</span>
                </button>
              </td>
            </tr>
          ))}
          {links.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                No hay links en este momento.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
