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
  const GH_RAW_BASE =
    "https://raw.githubusercontent.com/meowmi0122/rom-games-vault/refs/heads/main/public";
  const SIZE_LIMIT = 100 * 1024 * 1024; // 100MB

  function scan() {
    const root = path.resolve(process.cwd(), "public/games");
    const games: Array<{
      platform: string;
      slug: string;
      name: string;
      cover: string;
      rom: string;
      romFile: string;
      mtime: number;
    }> = [];
    if (!fs.existsSync(root)) return games;
    for (const platform of fs.readdirSync(root)) {
      const platDir = path.join(root, platform);
      if (!fs.statSync(platDir).isDirectory()) continue;
      for (const folder of fs.readdirSync(platDir)) {
        const gameDir = path.join(platDir, folder);
        if (!fs.statSync(gameDir).isDirectory()) continue;
        // slugify folder name: lowercase, replace non-[a-z0-9] with `-`
        const slug = folder
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "game";
        const files = fs.readdirSync(gameDir);
        const IMG = /\.(png|jpg|jpeg|webp|gif|avif|svg)$/i;
        const SKIP = /^(readme|notes?)\b|\.(md|txt)$/i;
        const cover = files.find((f) => IMG.test(f));
        // Prefer .zip, otherwise first non-image, non-readme file
        const rom =
          files.find((f) => /\.zip$/i.test(f)) ??
          files.find((f) => !IMG.test(f) && !SKIP.test(f) && !f.startsWith("."));
        if (!rom) continue;
        const romPath = path.join(gameDir, rom);
        const romStat = fs.statSync(romPath);
        const romSize = romStat.size;
        const enc = (s: string) => encodeURIComponent(s);
        const romRelative = `/games/${enc(platform)}/${enc(folder)}/${enc(rom)}`;
        const romUrl =
          romSize > SIZE_LIMIT ? `${GH_RAW_BASE}${romRelative}` : romRelative;
        const name = folder
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ");
        games.push({
          platform,
          slug,
          name,
          cover: cover ? `/games/${enc(platform)}/${enc(folder)}/${enc(cover)}` : "",
          rom: romUrl,
          romFile: rom,
          mtime: romStat.mtimeMs,
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
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
  vite: {
    plugins: [gamesManifestPlugin()],
  },
});
