declare module "virtual:games-manifest" {
  export const games: Array<{
    platform: string;
    slug: string;
    name: string;
    cover: string;
    rom: string;
    romFile: string;
    mtime: number;
  }>;
}