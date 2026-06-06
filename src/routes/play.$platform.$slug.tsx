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
    links: [
      { rel: "preconnect", href: "https://cdn.emulatorjs.org", crossOrigin: "" },
      { rel: "preconnect", href: "https://raw.githubusercontent.com", crossOrigin: "" },
      {
        rel: "preload",
        as: "script",
        href: "https://cdn.emulatorjs.org/stable/data/loader.js",
      },
    ],
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

    // Make the whole page the game — kill any margins/scroll from the doc.
    const prevHtml = document.documentElement.style.cssText;
    const prevBody = document.body.style.cssText;
    document.documentElement.style.cssText = "margin:0;padding:0;height:100%;overflow:hidden;background:#000";
    document.body.style.cssText = "margin:0;padding:0;height:100%;overflow:hidden;background:#000";

    const core = emulatorJsCore(game.platform);
    const w = window as any;
    w.EJS_player = "#game";
    w.EJS_core = core;
    w.EJS_gameUrl = game.rom;
    w.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    w.EJS_startOnLoaded = true;
    // Threads need SharedArrayBuffer → requires COOP/COEP headers we don't ship. Leave off.
    w.EJS_threads = false;
    w.EJS_gameName = game.name;

    document.title = game.name;

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    s.async = true;
    document.body.appendChild(s);

    return () => {
      s.remove();
      document.documentElement.style.cssText = prevHtml;
      document.body.style.cssText = prevBody;
    };
  }, [game]);

  return (
    <div style={{ width: "100%", height: "100vh", maxWidth: "100%" }}>
      <div id="game" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}