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

    if (isMaster && masterSecret) {
      const { data, error } = await supabase.rpc("admin_delete_link", {
        p_code: code.trim(),
        p_secret: masterSecret,
      });

      if (error || !data) {
        return NextResponse.json({ error: "No se pudo eliminar el link" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    if (pin && typeof pin === "string") {
      const { data, error } = await supabase.rpc("delete_my_link", {
        p_code: code.trim(),
        p_pin: pin.trim(),
      });

      if (error || !data) {
        return NextResponse.json(
          { error: "No se pudo eliminar el link (no te pertenece o ya no existe)" },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
