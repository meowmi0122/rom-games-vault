import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { gamesByPlatform, getPlatformMeta, platforms, type Game } from "@/lib/games";
import { useFavorites, useRecent } from "@/lib/storage";
import { GameCard } from "@/components/GameCard";
import { PlayModal } from "@/components/PlayModal";
import { SiteHeader } from "@/components/SiteHeader";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/platform/$platform")({
  loader: ({ params }) => {
    if (!platforms().includes(params.platform)) throw notFound();
    return { platform: params.platform };
  },
  head: ({ params }) => {
    const meta = getPlatformMeta(params.platform);
    return {
      meta: [
        { title: `${meta.full} — Game Vault` },
        { name: "description", content: `Play and download ${meta.full} ROMs in your browser.` },
      ],
    };
  },
  notFoundComponent: NotFoundView,
  errorComponent: ErrorView,
  component: PlatformPage,
});

function NotFoundView() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="mb-4 text-xl font-semibold">Platform not found</h1>
        <Link to="/" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Home</Link>
      </div>
    </div>
  );
}

function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="mb-4 text-xl font-semibold">Error</h1>
        <p className="mb-4 text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Retry</button>
      </div>
    </div>
  );
}

function PlatformPage() {
  const { platform } = Route.useLoaderData();
  const meta = getPlatformMeta(platform);
  const all = gamesByPlatform(platform);
  const { toggle, isFav } = useFavorites();
  const { push } = useRecent();
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<Game | null>(null);
  const { t } = useI18n();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? all.filter((g) => g.name.toLowerCase().includes(q)) : all;
  }, [all, query]);

  const handlePlay = (g: Game) => {
    push(`${g.platform}/${g.slug}`);
    setPlaying(g);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> {t("back")}
        </Link>

        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-3xl">{meta.icon}</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{meta.full}</h1>
            <p className="text-sm text-muted-foreground">
              {all.length} {t("games")} · {t("library")}
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 sm:w-72 focus-within:ring-2 focus-within:ring-ring">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("filter")}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            {t("noGames")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {filtered.map((g) => (
              <GameCard
                key={g.slug}
                game={g}
                isFav={isFav(`${g.platform}/${g.slug}`)}
                onPlay={handlePlay}
                onToggleFav={toggle}
              />
            ))}
          </div>
        )}
      </main>

      <PlayModal game={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}