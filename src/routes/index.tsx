import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { allGames, gamesByPlatform, getPlatformMeta, platforms, type Game } from "@/lib/games";
import { useFavorites, useRecent } from "@/lib/storage";
import { GameCard } from "@/components/GameCard";
import { PlayModal } from "@/components/PlayModal";
import { SiteHeader } from "@/components/SiteHeader";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Game Vault — ROM Library" },
      { name: "description", content: "Browse retro game platforms and play ROMs in your browser." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
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
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t("appName")}</h1>
          <p className="mt-2 text-muted-foreground">{t("tagline")}</p>
        </section>

        <div className="mb-10 flex max-w-md items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {query ? (
          <section className="mb-12">
            <SectionTitle>{t("searchResults")} ({results.length})</SectionTitle>
            <GameGrid games={results} onPlay={handlePlay} toggle={toggle} isFav={isFav} />
          </section>
        ) : (
          <>
            <section className="mb-12">
              <SectionTitle>{t("selectPlatform")}</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plats.map((p) => {
                  const meta = getPlatformMeta(p);
                  const count = gamesByPlatform(p).length;
                  return (
                    <Link
                      key={p}
                      to="/platform/$platform"
                      params={{ platform: p }}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                    >
                      <div className="text-3xl">{meta.icon}</div>
                      <div className="flex-1">
                        <div className="text-base font-semibold">{meta.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {meta.full} · {count} {t("games")}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {recentGames.length > 0 && (
              <section className="mb-12">
                <SectionTitle>{t("recentlyPlayed")}</SectionTitle>
                <GameGrid games={recentGames} onPlay={handlePlay} toggle={toggle} isFav={isFav} />
              </section>
            )}

            {favGames.length > 0 && (
              <section className="mb-12">
                <SectionTitle>{t("favorites")}</SectionTitle>
                <GameGrid games={favGames} onPlay={handlePlay} toggle={toggle} isFav={isFav} />
              </section>
            )}
          </>
        )}

        <footer className="mt-16 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          {t("dropHint")}
        </footer>
      </main>

      <PlayModal game={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{children}</h2>;
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
  const { t } = useI18n();
  if (games.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        {t("noGames")}
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