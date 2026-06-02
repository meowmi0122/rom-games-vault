import { Play, Download, Heart } from "lucide-react";
import type { Game } from "@/lib/games";

interface Props {
  game: Game;
  isFav: boolean;
  onPlay: (g: Game) => void;
  onToggleFav: (id: string) => void;
}

export function GameCard({ game, isFav, onPlay, onToggleFav }: Props) {
  const id = `${game.platform}/${game.slug}`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border-2 border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-[var(--neon-pink)] hover:glow-pink">
      <div className="relative aspect-square overflow-hidden bg-background scanlines">
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
          <div className="flex h-full w-full items-center justify-center text-4xl">💿</div>
        )}
        <button
          onClick={() => onToggleFav(id)}
          aria-label="favorite"
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 backdrop-blur transition hover:scale-110"
        >
          <Heart
            size={16}
            className={isFav ? "fill-[var(--neon-pink)] text-[var(--neon-pink)]" : "text-white"}
          />
        </button>
        <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-neon-cyan" style={{ fontFamily: "Press Start 2P, monospace" }}>
          {game.platform.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <h3 className="line-clamp-2 text-xs leading-tight text-foreground" title={game.name}>
          {game.name}
        </h3>
        <div className="mt-auto flex gap-2">
          <button onClick={() => onPlay(game)} className="arcade-btn arcade-btn-play flex-1">
            <Play size={12} fill="currentColor" /> Play
          </button>
          <a
            href={game.rom}
            download={game.romFile}
            className="arcade-btn arcade-btn-download"
            aria-label={`Download ${game.name}`}
          >
            <Download size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}