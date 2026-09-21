import { supabase } from "./supabase";

const ID_KEY = "mdt_creator_id";
const PIN_KEY = "mdt_creator_pin";

export function getStoredCreator(): { id: string; pin: string } | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(ID_KEY);
  const pin = window.localStorage.getItem(PIN_KEY);
  if (!id || !pin) return null;
  return { id, pin };
}

export async function ensureCreator(): Promise<{ id: string; pin: string } | null> {
  const existing = getStoredCreator();
  if (existing) return existing;

  const { data, error } = await supabase
    .rpc("create_creator")
    .maybeSingle<{ id: string; pin: string }>();
  if (error || !data) return null;

  const creator = { id: data.id, pin: data.pin };
  window.localStorage.setItem(ID_KEY, creator.id);
  window.localStorage.setItem(PIN_KEY, creator.pin);
  return creator;
}
