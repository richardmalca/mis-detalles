import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const alt = "Tengo un detalle para ti ✨ Abre tu universo";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let recipientName = "Ti";
  let isAmistad = false;

  try {
    const { data } = await supabase
      .rpc("get_love_link", { p_code: code })
      .maybeSingle();

    if (data) {
      recipientName = (data as { recipient_name?: string }).recipient_name?.trim() || "Ti";
      isAmistad = (data as { kind?: string }).kind === "amistad";
    }
  } catch {}

  const flowerEmoji = isAmistad ? "🌻" : "🌼";
  const badgeText = isAmistad ? "🌻 Para una amistad de oro" : "🌼 Para alguien muy especial";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #171105 0%, #0a0802 60%, #000000 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          padding: "60px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            background: "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.28), transparent 70%)",
          }}
        />

        <div
          style={{
            fontSize: 78,
            marginBottom: 16,
            filter: "drop-shadow(0 0 35px rgba(251, 191, 36, 0.7))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <span>✨</span>
          <span>{flowerEmoji}</span>
          <span>✨</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 28px",
            borderRadius: 9999,
            border: "1.5px solid rgba(251, 191, 36, 0.6)",
            backgroundColor: "rgba(251, 191, 36, 0.15)",
            color: "#fde047",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 26,
            boxShadow: "0 0 25px rgba(251, 191, 36, 0.3)",
          }}
        >
          {badgeText}
        </div>

        <div
          style={{
            fontSize: 66,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            marginBottom: 16,
            maxWidth: 1000,
            lineHeight: 1.12,
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          {recipientName}, tengo un detalle para ti
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#fef08a",
            maxWidth: 860,
            lineHeight: 1.45,
            fontWeight: 400,
            textShadow: "0 2px 15px rgba(0,0,0,0.8)",
          }}
        >
          Abre este enlace para descubrir el universo de flores amarillas y recuerdos que preparé para ti.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 44,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "rgba(255, 255, 255, 0.75)",
            fontSize: 21,
            fontWeight: 500,
            padding: "8px 24px",
            borderRadius: 9999,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <span>💛 Toca para abrir tu universo cósmico</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
