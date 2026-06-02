import { Play, Download, Heart } from "lucide-react";
import type { Game } from "@/lib/games";
import { useI18n } from "@/lib/i18n";

interface Props {
  game: Game;
  isFav: boolean;
  onPlay: (g: Game) => void;
  onToggleFav: (id: string) => void;
}

export function GameCard({ game, isFav, onPlay, onToggleFav }: Props) {
  const id = `${game.platform}/${game.slug}`;
  const { t } = useI18n();
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {game.cover ? (
          <img
            src={game.cover}
            alt={`${game.name} cover`}
            loading="lazy"
            width={512}
            height={512}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground">🎮</div>
        )}
        <button
          onClick={() => onToggleFav(id)}
          aria-label="favorite"
          className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 backdrop-blur transition hover:scale-110"
        >
          <Heart
            size={15}
            className={isFav ? "fill-primary text-primary" : "text-muted-foreground"}
          />
        </button>
        <span className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground backdrop-blur">
          {game.platform}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight" title={game.name}>
          {game.name}
        </h3>
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onPlay(game)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Play size={12} fill="currentColor" /> {t("play")}
          </button>
          <a
            href={game.rom}
            download={game.romFile}
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground transition hover:bg-accent"
            aria-label={t("download")}
          >
            <Download size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}