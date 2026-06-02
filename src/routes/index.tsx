import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { allGames, gamesByPlatform, getPlatformMeta, platforms, type Game } from "@/lib/games";
import { useFavorites, useRecent } from "@/lib/storage";
import { GameCard } from "@/components/GameCard";
import { PlayModal } from "@/components/PlayModal";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arcade Vault — Retro ROM Library" },
      { name: "description", content: "Browse retro game platforms and play ROMs in your browser." },
      { property: "og:title", content: "Arcade Vault" },
      { property: "og:description", content: "Retro ROM library with in-browser play." },
    ],
  }),
  component: Index,
});

function Index() {
  const plats = platforms();
  const { favs, toggle, isFav } = useFavorites();
  const { recent, push } = useRecent();
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<Game | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allGames.filter(
      (g) => g.name.toLowerCase().includes(q) || g.platform.includes(q),
    );
  }, [query]);

  const favGames = allGames.filter((g) => favs.includes(`${g.platform}/${g.slug}`));
  const recentGames = recent
    .map((id) => allGames.find((g) => `${g.platform}/${g.slug}` === id))
    .filter((g): g is Game => Boolean(g));

  const handlePlay = (g: Game) => {
    push(`${g.platform}/${g.slug}`);
    setPlaying(g);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mb-10 text-center">
          <h1 className="mb-3 text-2xl text-neon-pink md:text-4xl">ARCADE VAULT</h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground" style={{ fontFamily: "VT323, monospace" }}>
            Insert cartridge. Press START. Your retro ROM library, ready to play.
          </p>
        </section>

        <div className="mx-auto mb-10 flex max-w-md items-center gap-2 rounded border-2 border-border bg-card px-3 py-2 focus-within:border-[var(--neon-cyan)] focus-within:glow-cyan">
          <Search size={16} className="text-neon-cyan" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH GAMES..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            style={{ fontFamily: "VT323, monospace", fontSize: "1.1rem" }}
          />
        </div>

        {query ? (
          <section className="mb-12">
            <SectionTitle>SEARCH RESULTS ({results.length})</SectionTitle>
            <GameGrid games={results} onPlay={handlePlay} toggle={toggle} isFav={isFav} />
          </section>
        ) : (
          <>
            <section className="mb-12">
              <SectionTitle>SELECT PLATFORM</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plats.map((p) => {
                  const meta = getPlatformMeta(p);
                  const count = gamesByPlatform(p).length;
                  return (
                    <Link
                      key={p}
                      to="/platform/$platform"
                      params={{ platform: p }}
                      className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition hover:-translate-y-1 hover:border-[var(--neon-pink)] hover:glow-pink scanlines"
                    >
                      <div className="mb-3 text-4xl">{meta.icon}</div>
                      <div className="text-sm" style={{ fontFamily: "Press Start 2P, monospace", color: meta.color }}>
                        {meta.label}
                      </div>
                      <div className="mt-1 text-muted-foreground" style={{ fontFamily: "VT323, monospace", fontSize: "1rem" }}>
                        {meta.full} · {count} game{count === 1 ? "" : "s"}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {recentGames.length > 0 && (
              <section className="mb-12">
                <SectionTitle>RECENTLY PLAYED</SectionTitle>
                <GameGrid games={recentGames} onPlay={handlePlay} toggle={toggle} isFav={isFav} />
              </section>
            )}

            {favGames.length > 0 && (
              <section className="mb-12">
                <SectionTitle>FAVORITES</SectionTitle>
                <GameGrid games={favGames} onPlay={handlePlay} toggle={toggle} isFav={isFav} />
              </section>
            )}
          </>
        )}

        <footer className="mt-16 border-t-2 border-border pt-6 text-center text-xs text-muted-foreground" style={{ fontFamily: "VT323, monospace", fontSize: "1rem" }}>
          DROP ROMS INTO /public/games/&lt;platform&gt;/&lt;game&gt;/ — they show up here automatically.
        </footer>
      </main>

      <PlayModal game={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xs text-neon-cyan" style={{ fontFamily: "Press Start 2P, monospace" }}>
      ▸ {children}
    </h2>
  );
}

function GameGrid({
  games,
  onPlay,
  toggle,
  isFav,
}: {
  games: Game[];
  onPlay: (g: Game) => void;
  toggle: (id: string) => void;
  isFav: (id: string) => boolean;
}) {
  if (games.length === 0) {
    return (
      <p className="rounded border-2 border-dashed border-border p-6 text-center text-muted-foreground" style={{ fontFamily: "VT323, monospace", fontSize: "1.1rem" }}>
        No games found.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {games.map((g) => (
        <GameCard
          key={`${g.platform}/${g.slug}`}
          game={g}
          isFav={isFav(`${g.platform}/${g.slug}`)}
          onPlay={onPlay}
          onToggleFav={toggle}
        />
      ))}
    </div>
  );
}
