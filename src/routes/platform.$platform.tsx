import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { gamesByPlatform, getPlatformMeta, platforms, type Game } from "@/lib/games";
import { useFavorites, useRecent } from "@/lib/storage";
import { GameCard } from "@/components/GameCard";
import { PlayModal } from "@/components/PlayModal";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/platform/$platform")({
  loader: ({ params }) => {
    if (!platforms().includes(params.platform)) throw notFound();
    return { platform: params.platform };
  },
  head: ({ params }) => {
    const meta = getPlatformMeta(params.platform);
    return {
      meta: [
        { title: `${meta.full} ROMs — Arcade Vault` },
        { name: "description", content: `Play and download ${meta.full} ROMs in your browser.` },
        { property: "og:title", content: `${meta.full} ROMs` },
        { property: "og:description", content: `${meta.full} ROM library.` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="mb-4 text-xl text-neon-pink">PLATFORM NOT FOUND</h1>
        <Link to="/" className="arcade-btn arcade-btn-download">Back to home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="mb-4 text-xl text-neon-pink">SYSTEM ERROR</h1>
        <p className="mb-4 text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="arcade-btn arcade-btn-play">Retry</button>
      </div>
    </div>
  ),
  component: PlatformPage,
});

function PlatformPage() {
  const { platform } = Route.useLoaderData();
  const meta = getPlatformMeta(platform);
  const all = gamesByPlatform(platform);
  const { toggle, isFav } = useFavorites();
  const { push } = useRecent();
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<Game | null>(null);

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
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-xs text-neon-cyan hover:text-neon-pink" style={{ fontFamily: "Press Start 2P, monospace" }}>
          <ArrowLeft size={14} /> BACK
        </Link>

        <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-3xl">{meta.icon}</div>
            <h1 className="mt-2 text-xl md:text-2xl" style={{ color: meta.color }}>
              {meta.full}
            </h1>
            <p className="text-muted-foreground" style={{ fontFamily: "VT323, monospace", fontSize: "1.1rem" }}>
              {all.length} game{all.length === 1 ? "" : "s"} in library
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded border-2 border-border bg-card px-3 py-2 sm:w-72 focus-within:border-[var(--neon-cyan)]">
            <Search size={14} className="text-neon-cyan" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="FILTER..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ fontFamily: "VT323, monospace", fontSize: "1.05rem" }}
            />
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="rounded border-2 border-dashed border-border p-10 text-center text-muted-foreground" style={{ fontFamily: "VT323, monospace", fontSize: "1.1rem" }}>
            No games. Drop ROMs into <code>/public/games/{platform}/</code>.
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