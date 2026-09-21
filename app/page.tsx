"use client";

import { useState } from "react";
import { GalaxyExperience } from "@/components/galaxy/galaxy-experience";
import { LinkGenerator } from "@/components/experience/link-generator";
import { PlusCircle, X } from "lucide-react";

export default function Home() {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none">
      <GalaxyExperience />

      <div className="absolute bottom-4 left-4 z-30 pointer-events-auto sm:bottom-6 sm:left-6">
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-zinc-950/90 px-3.5 py-2 text-xs font-bold text-amber-300 shadow-2xl backdrop-blur-xl transition-all hover:bg-amber-400/10 hover:border-amber-300 active:scale-95 whitespace-nowrap"
        >
          {showGenerator ? (
            <>
              <X className="h-3.5 w-3.5" />
              <span>Cerrar</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Crear mi universo</span>
            </>
          )}
        </button>
      </div>

      {showGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md pointer-events-auto overflow-y-auto">
          <div className="relative w-full max-w-md my-auto">
            <button
              onClick={() => setShowGenerator(false)}
              className="absolute -top-3 -right-2 z-10 rounded-full bg-zinc-800 p-1.5 text-zinc-300 hover:text-white"
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
