"use client";

import { useState } from "react";
import { getExperienceContent, ExperienceKind } from "@/lib/content";
import { OpeningCard } from "./opening-card";
import { RevealSection } from "./reveal-section";
import { LeaveMessageForm } from "./leave-message-form";
import { AnimatedFlower } from "./animated-flower";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export function SharedExperience({
  recipientName,
  kind,
}: {
  recipientName: string;
  kind: ExperienceKind;
}) {
  const [opened, setOpened] = useState(false);
  const content = getExperienceContent(kind, recipientName);

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white selection:bg-amber-500/30">
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_60%)]" />

      <header className="fixed top-4 left-4 z-40 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/80 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver al cosmos</span>
        </Link>
      </header>

      {!opened && (
        <OpeningCard
          recipientName={recipientName}
          onOpen={() => setOpened(true)}
        />
      )}

      {opened && (
        <div className="relative z-10 flex flex-col items-center">
          <RevealSection className="min-h-[85vh]">
            <div className="flex max-w-xl flex-col items-center gap-5">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                {content.badge}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl drop-shadow-md">
                {recipientName}
              </h2>
              <p className="text-lg leading-relaxed text-zinc-200 sm:text-xl font-light">
                {content.intro}
              </p>
              <div className="pt-2">
                <AnimatedFlower size={48} />
              </div>
            </div>
          </RevealSection>

          {content.phrases.map((phrase, idx) => (
            <RevealSection key={idx}>
              <div className="max-w-lg rounded-2xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-lg shadow-2xl">
                <p className="text-lg sm:text-2xl font-light leading-relaxed text-zinc-100">
                  “{phrase}”
                </p>
              </div>
            </RevealSection>
          ))}

          <RevealSection>
            <div className="flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-amber-400/20 bg-zinc-950/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
              <AnimatedFlower size={64} />
              <h3 className="text-2xl font-bold text-amber-200 sm:text-3xl">
                {content.finalTitle}
              </h3>
              <p className="text-base leading-relaxed text-zinc-300">
                {content.finalMessage}
              </p>
              <div className="w-full pt-4">
                <LeaveMessageForm prompt={content.formPrompt} />
              </div>
            </div>
          </RevealSection>
        </div>
      )}
    </div>
  );
}
