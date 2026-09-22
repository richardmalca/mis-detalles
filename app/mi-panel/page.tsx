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
  Trash2,
  Pencil,
  Dices,
  PenLine,
  X,
} from "lucide-react";
import Link from "next/link";

const CUSTOM_FIELD_LIMIT = 200;

interface LinkRow {
  code: string;
  recipient_name: string;
  kind: string;
  created_at: string;
  opened_at: string | null;
  completed_at: string | null;
  open_count: number;
  mode: string;
  custom_memory: string | null;
  custom_final: string | null;
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

  const [deleteModal, setDeleteModal] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editModal, setEditModal] = useState<LinkRow | null>(null);
  const [editMode, setEditMode] = useState<"auto" | "custom">("auto");
  const [editMemory, setEditMemory] = useState("");
  const [editFinal, setEditFinal] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  function openEditModal(row: LinkRow) {
    setEditModal(row);
    setEditMode(row.mode === "custom" ? "custom" : "auto");
    setEditMemory(row.custom_memory || "");
    setEditFinal(row.custom_final || "");
    setEditError(null);
  }

  async function confirmEdit() {
    if (!editModal) return;
    setIsSaving(true);
    setEditError(null);

    const { data, error } = await supabase.rpc("update_my_link", {
      p_code: editModal.code,
      p_pin: pin.trim(),
      p_mode: editMode,
      p_custom_memory: editMode === "custom" ? editMemory.trim() : null,
      p_custom_final: editMode === "custom" ? editFinal.trim() : null,
    });

    if (error || !data) {
      setEditError("No se pudo guardar el cambio.");
      setIsSaving(false);
      return;
    }

    setRows((prev) =>
      prev
        ? prev.map((r) =>
            r.code === editModal.code
              ? {
                  ...r,
                  mode: editMode,
                  custom_memory: editMode === "custom" ? editMemory.trim() : null,
                  custom_final: editMode === "custom" ? editFinal.trim() : null,
                }
              : r
          )
        : prev
    );
    setIsSaving(false);
    setEditModal(null);
  }

  async function confirmDelete() {
    if (!deleteModal) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/delete-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: deleteModal.code, pin }),
      });

      if (res.ok) {
        setRows((prev) => (prev ? prev.filter((r) => r.code !== deleteModal.code) : []));
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
                        <span
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            row.mode === "custom"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : "border-sky-500/30 bg-sky-500/10 text-sky-300"
                          }`}
                        >
                          {row.mode === "custom" ? (
                            <>
                              <PenLine className="h-3 w-3" /> Personalizado
                            </>
                          ) : (
                            <>
                              <Dices className="h-3 w-3" /> Automático
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {row.opened_at ? (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>
                              {row.open_count === 1
                                ? "Abierto 1 vez"
                                : `Abierto ${row.open_count} veces`}
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-zinc-800/80 border border-white/5 px-2.5 py-0.5 text-[11px] text-zinc-400">
                            <Clock className="h-3 w-3" />
                            <span>Sin abrir</span>
                          </span>
                        )}

                        {row.completed_at && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/35 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]">
                            <Sparkles className="h-3 w-3 text-amber-400" />
                            <span>Leyó todo ✨</span>
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

                        <button
                          type="button"
                          onClick={() => openEditModal(row)}
                          className="flex items-center gap-1 text-zinc-500 hover:text-violet-300 transition-colors"
                          title="Editar automático/personalizado"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteModal({ code: row.code, name: row.recipient_name });
                          }}
                          className="flex items-center gap-1 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Eliminar este link"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-y-1 text-[11px] text-zinc-500 pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-zinc-400" /> Creado: {formatDate(row.created_at)}
                      </span>
                      {row.opened_at && (
                        <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                          <Eye className="h-3 w-3 text-emerald-400" /> Lecturas: <strong>{row.open_count}</strong> · Última: {formatDate(row.opened_at)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
                    El link para <strong className="text-rose-300 font-semibold">{deleteModal.name}</strong> dejará de estar disponible y nadie podrá abrirlo.
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

          {editModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
              <div className="w-full max-w-md rounded-3xl border border-violet-500/30 bg-zinc-950 p-6 shadow-2xl space-y-4 max-h-[85dvh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    Editar historia de {editModal.recipient_name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditModal(null)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditMode("auto")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      editMode === "auto"
                        ? "border-sky-500/50 bg-sky-500/15 text-sky-300"
                        : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <Dices className="h-3.5 w-3.5" />
                    Automático
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode("custom")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      editMode === "custom"
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                        : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <PenLine className="h-3.5 w-3.5" />
                    Personalizado
                  </button>
                </div>

                {editMode === "custom" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-300">
                          Un recuerdo específico
                        </label>
                        <span className="text-[10px] text-zinc-500">
                          {editMemory.length}/{CUSTOM_FIELD_LIMIT}
                        </span>
                      </div>
                      <textarea
                        value={editMemory}
                        maxLength={CUSTOM_FIELD_LIMIT}
                        onChange={(e) => setEditMemory(e.target.value)}
                        rows={2}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/60"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-300">
                          Tu mensaje final
                        </label>
                        <span className="text-[10px] text-zinc-500">
                          {editFinal.length}/{CUSTOM_FIELD_LIMIT}
                        </span>
                      </div>
                      <textarea
                        value={editFinal}
                        maxLength={CUSTOM_FIELD_LIMIT}
                        onChange={(e) => setEditFinal(e.target.value)}
                        rows={2}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/60"
                      />
                    </div>
                  </div>
                )}

                {editError && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                    {editError}
                  </p>
                )}

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setEditModal(null)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 active:scale-95 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={confirmEdit}
                    className="flex-1 rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
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
