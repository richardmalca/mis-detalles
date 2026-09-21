import type { Metadata } from "next";
import { SharedExperience } from "@/components/experience/shared-experience";
import { NotFoundCard } from "@/components/experience/not-found-card";
import { supabase } from "@/lib/supabase";
import type { ExperienceKind } from "@/lib/content";

export const metadata: Metadata = {
  title: "Universo Personalizado | Mis Detalles 🌼",
  description: "Una experiencia cósmica de amor y amistad.",
};

interface ExperienciaPageProps {
  params: Promise<{ code: string }>;
}

interface LoveLinkData {
  kind?: string;
  recipient_name?: string;
}

export default async function ExperienciaPage({ params }: ExperienciaPageProps) {
  const { code } = await params;

  try {
    const { data, error } = await supabase
      .rpc("get_love_link", { p_code: code })
      .maybeSingle();

    if (error || !data) {
      return <NotFoundCard />;
    }

    const linkData = data as LoveLinkData;
    const kind: ExperienceKind = linkData.kind === "amistad" ? "amistad" : "amor";
    const recipientName = linkData.recipient_name || "Ti";

    return <SharedExperience recipientName={recipientName} kind={kind} />;
  } catch {
    return <NotFoundCard />;
  }
}
