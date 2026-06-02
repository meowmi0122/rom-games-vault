import { games as rawGames } from "virtual:games-manifest";

export type Game = (typeof rawGames)[number];

export const PLATFORM_META: Record<
  string,
  { label: string; full: string; color: string; icon: string }
> = {
  nds: { label: "NDS", full: "Nintendo DS", color: "var(--neon-pink)", icon: "🎮" },
  gba: { label: "GBA", full: "Game Boy Advance", color: "var(--neon-cyan)", icon: "👾" },
  snes: { label: "SNES", full: "Super Nintendo", color: "var(--neon-purple)", icon: "🕹️" },
  nes: { label: "NES", full: "Nintendo", color: "var(--neon-yellow)", icon: "🎲" },
  gb: { label: "GB", full: "Game Boy", color: "var(--neon-green)", icon: "📟" },
  n64: { label: "N64", full: "Nintendo 64", color: "var(--neon-pink)", icon: "🎯" },
};

export function getPlatformMeta(p: string) {
  return (
    PLATFORM_META[p] ?? {
      label: p.toUpperCase(),
      full: p.toUpperCase(),
      color: "var(--neon-cyan)",
      icon: "💿",
    }
  );
}

export const allGames = rawGames;

export function gamesByPlatform(platform: string) {
  return allGames.filter((g) => g.platform === platform);
}

export function platforms() {
  const set = new Set(allGames.map((g) => g.platform));
  return Array.from(set).sort();
}

export function findGame(platform: string, slug: string) {
  return allGames.find((g) => g.platform === platform && g.slug === slug);
}

/* EmulatorJS core mapping (cdn.emulatorjs.org) */
const EJS_CORES: Record<string, string> = {
  nds: "melonds",
  gba: "gba",
  gb: "gb",
  gbc: "gb",
  nes: "nes",
  snes: "snes",
  n64: "n64",
  segaMS: "segaMS",
  segaMD: "segaMD",
};

export function emulatorJsCore(platform: string) {
  return EJS_CORES[platform] ?? platform;
}