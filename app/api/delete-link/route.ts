import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { code, pin, secret } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Código requerido" }, { status: 400 });
    }

    const masterSecret = process.env.PANEL_SECRET;

    if (secret && secret === masterSecret) {
      const { error: rpcError } = await supabase.rpc("delete_link_master", {
        p_code: code,
        p_secret: secret,
      });

      if (rpcError) {
        await supabase.from("love_links").delete().eq("code", code);
      }

      return NextResponse.json({ success: true });
    }

    if (pin && typeof pin === "string") {
      const { error: rpcError } = await supabase.rpc("delete_my_link", {
        p_code: code,
        p_pin: pin.trim(),
      });

      if (rpcError) {
        const { data: creator } = await supabase
          .from("creators")
          .select("id")
          .eq("pin", pin.trim())
          .maybeSingle();

        if (creator) {
          await supabase
            .from("love_links")
            .delete()
            .eq("code", code)
            .eq("creator_id", creator.id);
        } else {
          return NextResponse.json({ error: "PIN no autorizado" }, { status: 403 });
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
