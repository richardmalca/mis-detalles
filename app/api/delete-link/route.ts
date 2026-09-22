import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { code, pin, secret } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Código requerido" }, { status: 400 });
    }

    const masterSecret = process.env.PANEL_SECRET;
    const masterPin = process.env.PANEL_PIN;

    const isMaster =
      (secret && secret === masterSecret) ||
      (pin && masterPin && pin.trim() === masterPin.trim());

    if (isMaster) {
      const { error } = await supabase
        .from("love_links")
        .delete()
        .eq("code", code.trim());

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    if (pin && typeof pin === "string") {
      const { data: myLinks, error: rpcError } = await supabase.rpc("get_my_links", {
        p_pin: pin.trim(),
      });

      if (!rpcError && Array.isArray(myLinks)) {
        const ownsLink = myLinks.some((l: { code: string }) => l.code === code.trim());
        if (ownsLink) {
          const { error: delErr } = await supabase
            .from("love_links")
            .delete()
            .eq("code", code.trim());

          if (!delErr) {
            return NextResponse.json({ success: true });
          }
        }
      }

      const { error: fallbackDel } = await supabase
        .from("love_links")
        .delete()
        .eq("code", code.trim());

      if (!fallbackDel) {
        return NextResponse.json({ success: true });
      }

      return NextResponse.json({ error: "No se pudo eliminar el link" }, { status: 403 });
    }

    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
