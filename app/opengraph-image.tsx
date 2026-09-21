import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Mis Detalles - Un Universo Para Ti";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          background: "radial-gradient(circle at center, #1a0f30 0%, #080314 50%, #020108 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 30%, rgba(251, 191, 36, 0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.18), transparent 45%)",
          }}
        />

        <div
          style={{
            fontSize: 74,
            marginBottom: 16,
            filter: "drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))",
          }}
        >
          🌻 ✨
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 24px",
            borderRadius: 9999,
            border: "1px solid rgba(251, 191, 36, 0.4)",
            backgroundColor: "rgba(251, 191, 36, 0.1)",
            color: "#fde047",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Tengo un detalle para ti
        </div>

        <div
          style={{
            fontSize: 54,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            marginBottom: 20,
            maxWidth: 900,
            lineHeight: 1.15,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          Abre esto para ver el universo que preparé para ti
        </div>

        <div
          style={{
            fontSize: 26,
            color: "rgba(253, 230, 138, 0.9)",
            maxWidth: 750,
            lineHeight: 1.4,
            fontWeight: 400,
          }}
        >
          Entre constelaciones, flores amarillas y palabras dedicadas con todo mi cariño.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 20,
          }}
        >
          <span>✨ Toca para explorar tu universo</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
