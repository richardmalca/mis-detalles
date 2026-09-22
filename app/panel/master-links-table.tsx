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
  const [deleteModal, setDeleteModal] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deleteModal) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/delete-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: deleteModal.code, secret: secretKey }),
      });

      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.code !== deleteModal.code));
        setDeleteModal(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error || "No se pudo eliminar el link.");
      }
    } catch {
      setDeleteError("Error de conexión al eliminar.");
    } finally {
      setIsDeleting(false);
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
                  onClick={() => {
                    setDeleteError(null);
                    setDeleteModal({ code: row.code, name: row.recipient_name });
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
                  title="Eliminar link"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Borrar</span>
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

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-rose-500/30 bg-zinc-950 p-6 text-center shadow-2xl space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                ¿Eliminar este universo?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                El link para <strong className="text-rose-300 font-semibold">{deleteModal.name}</strong> será eliminado permanentemente de la base de datos.
              </p>
            </div>

            {deleteError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                {deleteError}
              </p>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModal(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 active:scale-95 transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
