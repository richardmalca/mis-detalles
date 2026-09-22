import { supabase } from "@/lib/supabase";
import { MasterLinksTable } from "./master-links-table";

export const metadata = {
  title: "Panel privado",
  robots: { index: false, follow: false },
};

interface LinkRow {
  code: string;
  recipient_name: string;
  kind: string;
  created_at: string;
  opened_at: string | null;
  completed_at: string | null;
  open_count: number;
}

interface MessageRow {
  sender_name: string | null;
  message: string;
  created_at: string;
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PanelPage(
  props: PageProps<"/panel">
) {
  const searchParams = await props.searchParams;
  const rawKey = searchParams.key;
  const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;

  if (!key) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#04010c] px-6 text-center text-zinc-400">
        <p>Acceso restringido.</p>
      </main>
    );
  }

  const [{ data: links }, { data: messages }] = await Promise.all([
    supabase.rpc("get_all_links", { p_secret: key }),
    supabase.rpc("get_all_messages", { p_secret: key }),
  ]);

  const linkRows = (links ?? []) as LinkRow[];
  const messageRows = (messages ?? []) as MessageRow[];

  if (linkRows.length === 0 && messageRows.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#04010c] px-6 text-center text-zinc-400">
        <p>Acceso restringido o sin datos todavía.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#04010c] px-4 py-10 text-zinc-100 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-bold text-amber-200">
          Panel privado
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          No compartas esta URL. Solo tú deberías tener este link.
        </p>

        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-300/80">
            Links generados ({linkRows.length})
          </h2>
          <MasterLinksTable initialLinks={linkRows} secretKey={key} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-300/80">
            Mensajes dejados ({messageRows.length})
          </h2>
          <div className="flex flex-col gap-3">
            {messageRows.map((msg, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-sm text-zinc-200">{msg.message}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {msg.sender_name || "Anónimo"} · {formatDate(msg.created_at)}
                </p>
              </div>
            ))}
            {messageRows.length === 0 && (
              <p className="text-sm text-zinc-600">
                Todavía no hay mensajes.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
