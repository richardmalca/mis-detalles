import { supabase } from "./supabase";

const CREATOR_ID_KEY = "mdt_creator_id";
const CREATOR_PIN_KEY = "mdt_creator_pin";

export function getStoredCreator(): { id: string; pin: string } | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(CREATOR_ID_KEY);
  const pin = window.localStorage.getItem(CREATOR_PIN_KEY);
  if (!id || !pin) return null;
  return { id, pin };
}

export function saveStoredCreator(id: string, pin: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CREATOR_ID_KEY, id);
  window.localStorage.setItem(CREATOR_PIN_KEY, pin);
}

export async function ensureCreator(): Promise<{ id: string; pin: string } | null> {
  const existing = getStoredCreator();
  if (existing) return existing;

  const { data, error } = await supabase
    .rpc("create_creator")
    .maybeSingle<{ id: string; pin: string }>();

  if (error || !data) return null;

  const creator = { id: data.id, pin: data.pin };
  saveStoredCreator(creator.id, creator.pin);
  return creator;
}
