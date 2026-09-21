"use client";

import { useState } from "react";
import { GalaxyExperience } from "@/components/galaxy/galaxy-experience";
import { LinkGenerator } from "@/components/experience/link-generator";
import { PlusCircle, Compass, X } from "lucide-react";

export default function Home() {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <GalaxyExperience />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="flex items-center gap-2 rounded-full border border-amber-400/40 bg-zinc-950/80 px-4 py-2 text-xs font-bold text-amber-300 shadow-2xl backdrop-blur-xl transition-all hover:bg-amber-400/10 hover:border-amber-300 active:scale-95"
        >
          {showGenerator ? (
            <>
              <X className="h-4 w-4" />
              <span>Cerrar creador</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Crear mi propio universo</span>
            </>
          )}
        </button>
      </div>

      {showGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md pointer-events-auto">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowGenerator(false)}
              className="absolute -top-3 -right-3 z-10 rounded-full bg-zinc-800 p-2 text-zinc-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <LinkGenerator />
          </div>
        </div>
      )}
    </main>
  );
}
