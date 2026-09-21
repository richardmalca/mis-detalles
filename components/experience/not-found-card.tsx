import { Compass } from "lucide-react";

export function NotFoundCard() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-6 text-center text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(239,68,68,0.12),transparent_60%)]" />

      <div className="relative flex max-w-sm flex-col items-center gap-4 rounded-3xl border border-white/10 bg-zinc-900/80 p-8 backdrop-blur-xl shadow-2xl">
        <Compass className="h-10 w-10 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Coordenadas no encontradas
        </h1>

        <p className="text-sm leading-relaxed text-zinc-300">
          El enlace que abriste no corresponde a ningún universo activo o ha expirado.
        </p>
      </div>
    </div>
  );
}
