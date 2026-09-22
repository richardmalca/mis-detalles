import type { Metadata } from "next";
import { SharedExperience } from "@/components/experience/shared-experience";
import { NotFoundCard } from "@/components/experience/not-found-card";
import { supabase } from "@/lib/supabase";
import type { ExperienceKind } from "@/lib/content";

interface ExperienciaPageProps {
  params: Promise<{ code: string }>;
}

interface LoveLinkData {
  kind?: string;
  recipient_name?: string;
  occasion_id?: string;
  mode?: string;
  custom_memory?: string | null;
  custom_final?: string | null;
}

export async function generateMetadata({
  params,
}: ExperienciaPageProps): Promise<Metadata> {
  const { code } = await params;

  try {
    const { data } = await supabase
      .rpc("get_love_link", { p_code: code })
      .maybeSingle();

    const linkData = data as LoveLinkData;
    const name = linkData?.recipient_name?.trim() || "ti";
    const icon = linkData?.kind === "amistad" ? "🌻" : "🌼";

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://mis-detalles-three.vercel.app");

    const staticOgUrl = `${baseUrl}/og-image.png`;

    return {
      title: `${name}, tengo un detalle para ti ${icon} Abre tu universo`,
      description: `Un universo de flores amarillas, constelaciones y palabras dedicado especialmente para ti, ${name}. Toca para entrar.`,
      openGraph: {
        title: `${name}, preparé un universo para ti ${icon}`,
        description: `Entra para descubrir las flores amarillas, recuerdos y palabras que te dedico bajo el cosmos.`,
        type: "website",
        images: [
          {
            url: staticOgUrl,
            width: 1200,
            height: 630,
            alt: `Detalle de flores amarillas para ${name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${name}, preparé un universo para ti ${icon}`,
        description: `Entra para descubrir las flores amarillas, recuerdos y palabras que te dedico bajo el cosmos.`,
        images: [staticOgUrl],
      },
    };
  } catch {
    return {
      title: "Tengo un detalle especial para ti ✨ Abre tu universo",
      description: "Entra para descubrir el universo de flores amarillas y palabras dedicadas.",
    };
  }
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
    const occasionId = linkData.occasion_id || "flores-amarillas";

    return (
      <SharedExperience
        recipientName={recipientName}
        kind={kind}
        code={code}
        occasionId={occasionId}
        mode={linkData.mode}
        customMemory={linkData.custom_memory}
        customFinal={linkData.custom_final}
      />
    );
  } catch {
    return <NotFoundCard />;
  }
}
