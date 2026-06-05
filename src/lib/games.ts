import { games as rawGames } from "virtual:games-manifest";
import { platformLabels, gameNames } from "@/config/labels";

export type Game = (typeof rawGames)[number];

export function getPlatformMeta(p: string) {
  const override = platformLabels[p];
  return {
    label: override?.label ?? p.toUpperCase(),
    full: override?.full ?? p.toUpperCase(),
  };
}

export const allGames: Game[] = rawGames.map((g) => {
  const key = `${g.platform}/${g.slug}`;
  return gameNames[key] ? { ...g, name: gameNames[key] } : g;
});

export function gamesByPlatform(platform: string) {
  return allGames
    .filter((g) => g.platform === platform)
    .sort((a, b) => a.mtime - b.mtime);
}

export function platforms() {
  const set = new Set(allGames.map((g) => g.platform));
  return Array.from(set).sort();
}

export function findGame(platform: string, slug: string) {
  return allGames.find((g) => g.platform === platform && g.slug === slug);
}

/* Platform folder name IS the EmulatorJS core (lowercase short name). */
export function emulatorJsCore(platform: string) {
  return platform.toLowerCase();
}