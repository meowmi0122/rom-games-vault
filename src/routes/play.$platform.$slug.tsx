import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { findGame, emulatorJsCore } from "@/lib/games";

export const Route = createFileRoute("/play/$platform/$slug")({
  loader: ({ params }) => {
    const game = findGame(params.platform, params.slug);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ params }) => ({
    meta: [{ title: `Play ${params.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <p>Game not found</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <p>{error.message}</p>
    </div>
  ),
  component: PlayPage,
});

function PlayPage() {
  const { game } = Route.useLoaderData();
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

    document.title = game.name;

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    s.async = true;
    document.body.appendChild(s);

    return () => {
      s.remove();
    };
  }, [game]);

  return <div id="game" className="fixed inset-0 h-screen w-screen bg-black" />;
}