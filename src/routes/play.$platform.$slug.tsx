import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { findGame, emulatorJsCore } from "@/lib/games";

export const Route = createFileRoute("/play/$platform/$slug")({
  loader: ({ params }) => {
    const game = findGame(params.platform, params.slug);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ params }) => ({
    meta: [
      { title: `Play ${params.slug} — Arcade Vault` },
      { name: "description", content: "Play retro ROMs in the browser." },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen p-8 text-center">
      <h1 className="text-xl text-neon-pink">GAME NOT FOUND</h1>
      <Link to="/" className="arcade-btn arcade-btn-download mt-4 inline-flex">Home</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen p-8 text-center">
      <h1 className="text-xl text-neon-pink">EMULATOR ERROR</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="arcade-btn arcade-btn-play mt-4">Retry</button>
    </div>
  ),
  component: PlayPage,
});

function PlayPage() {
  const { game } = Route.useLoaderData();
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const core = emulatorJsCore(game.platform);
    const w = window as any;
    w.EJS_player = "#game";
    w.EJS_core = core;
    w.EJS_gameUrl = game.rom;
    w.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    w.EJS_startOnLoaded = true;
    w.EJS_gameName = game.name;

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    s.async = true;
    document.body.appendChild(s);

    return () => {
      s.remove();
    };
  }, [game]);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="flex items-center justify-between border-b-2 border-border bg-background/80 px-4 py-2">
        <Link to="/platform/$platform" params={{ platform: game.platform }} className="inline-flex items-center gap-2 text-xs text-neon-cyan" style={{ fontFamily: "Press Start 2P, monospace" }}>
          <ArrowLeft size={14} /> EXIT
        </Link>
        <div className="text-xs text-neon-pink truncate" style={{ fontFamily: "Press Start 2P, monospace" }}>
          {game.name}
        </div>
        <div className="text-xs text-muted-foreground" style={{ fontFamily: "Press Start 2P, monospace" }}>
          {game.platform.toUpperCase()}
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center p-2">
        <div ref={containerRef} id="game" className="aspect-video w-full max-w-5xl bg-black" />
      </div>
    </div>
  );
}