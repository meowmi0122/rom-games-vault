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
    .sort((a, b) => a.mtime - b.mtime || a.name.localeCompare(b.name));
}

export function platforms() {
  const set = new Set(allGames.map((g) => g.platform));
  return Array.from(set).sort();
}

export function findGame(platform: string, slug: string) {
  return allGames.find((g) => g.platform === platform && g.slug === slug);
}

/* Map our platform short-name (folder) → actual EmulatorJS core id.
 * Source: https://emulatorjs.org/docs4devs/cores
 * Folder stays the short name (e.g. "nds"), but EmuJS needs "melonds". */
const EJS_CORES: Record<string, string> = {
  nds: "melonds",
  gb: "gambatte",
  gbc: "gambatte",
  gba: "mgba",
  nes: "nes",
  snes: "snes9x",
  n64: "mupen64plus_next",
  psx: "pcsx_rearmed",
  ps1: "pcsx_rearmed",
  segams: "genesis_plus_gx",
  segamd: "genesis_plus_gx",
  segacd: "genesis_plus_gx",
  segagg: "genesis_plus_gx",
  segasaturn: "yabause",
  sega32x: "picodrive",
  "3do": "opera",
  atari2600: "stella2014",
  atari7800: "prosystem",
  lynx: "handy",
  jaguar: "virtualjaguar",
  arcade: "fbneo",
  mame: "mame2003_plus",
  vb: "beetle_vb",
  pce: "mednafen_pce",
  ngp: "mednafen_ngp",
  ws: "mednafen_wswan",
};
export function emulatorJsCore(platform: string) {
  const key = platform.toLowerCase();
  return EJS_CORES[key] ?? key;
}