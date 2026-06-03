// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";

function gamesManifestPlugin() {
  const virtualId = "virtual:games-manifest";
  const resolvedId = "\0" + virtualId;

  function scan() {
    const root = path.resolve(process.cwd(), "public/games");
    const games: Array<{
      platform: string;
      slug: string;
      name: string;
      cover: string;
      rom: string;
      romFile: string;
    }> = [];
    if (!fs.existsSync(root)) return games;
    for (const platform of fs.readdirSync(root)) {
      const platDir = path.join(root, platform);
      if (!fs.statSync(platDir).isDirectory()) continue;
      for (const slug of fs.readdirSync(platDir)) {
        const gameDir = path.join(platDir, slug);
        if (!fs.statSync(gameDir).isDirectory()) continue;
        const files = fs.readdirSync(gameDir);
        const rom = files.find((f) => /^rom\./i.test(f));
        const cover = files.find((f) => /^cover\.(png|jpg|jpeg|webp|gif)$/i.test(f));
        if (!rom) continue;
        const name = slug
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ");
        games.push({
          platform,
          slug,
          name,
          cover: cover ? `/games/${platform}/${slug}/${cover}` : "",
          rom: `/games/${platform}/${slug}/${rom}`,
          romFile: rom,
        });
      }
    }
    return games;
  }

  return {
    name: "games-manifest",
    resolveId(id: string) {
      if (id === virtualId) return resolvedId;
    },
    load(id: string) {
      if (id === resolvedId) {
        return `export const games = ${JSON.stringify(scan())};`;
      }
    },
    configureServer(server: any) {
      const watcher = fs.watch(
        path.resolve(process.cwd(), "public/games"),
        { recursive: true },
        () => {
          const mod = server.moduleGraph.getModuleById(resolvedId);
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: "full-reload" });
        },
      );
      server.httpServer?.once("close", () => watcher.close());
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
  vite: {
    plugins: [gamesManifestPlugin()],
  },
});
