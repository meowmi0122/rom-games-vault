import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "zh" | "en";

const dict = {
  zh: {
    appName: "遊戲庫",
    tagline: "瀏覽你的 ROM 收藏，直接在瀏覽器中遊玩。",
    selectPlatform: "選擇平台",
    search: "搜尋遊戲...",
    filter: "篩選...",
    searchResults: "搜尋結果",
    recentlyPlayed: "最近遊玩",
    favorites: "收藏",
    play: "遊玩",
    download: "下載",
    back: "返回",
    home: "首頁",
    noGames: "找不到遊戲。",
    games: "款遊戲",
    selectEmulator: "選擇模擬器",
    playInBrowser: "在瀏覽器中即時遊玩",
    openInRomM: "在 RomM 圖書館中開啟",
    notFound: "找不到頁面",
    platformNotFound: "找不到平台",
    gameNotFound: "找不到遊戲",
    emulatorError: "模擬器錯誤",
    retry: "重試",
    exit: "離開",
    dropHint: "將 ROM 放到 /public/games/<platform>/<game>/ 即可自動顯示。",
    library: "個收藏",
    light: "淺色",
    dark: "深色",
  },
  en: {
    appName: "Game Vault",
    tagline: "Browse your ROM collection and play directly in the browser.",
    selectPlatform: "Select Platform",
    search: "Search games...",
    filter: "Filter...",
    searchResults: "Search Results",
    recentlyPlayed: "Recently Played",
    favorites: "Favorites",
    play: "Play",
    download: "Download",
    back: "Back",
    home: "Home",
    noGames: "No games found.",
    games: "games",
    selectEmulator: "Select Emulator",
    playInBrowser: "Play instantly in the browser",
    openInRomM: "Open in your RomM library",
    notFound: "Page not found",
    platformNotFound: "Platform not found",
    gameNotFound: "Game not found",
    emulatorError: "Emulator error",
    retry: "Retry",
    exit: "Exit",
    dropHint: "Drop ROMs into /public/games/<platform>/<game>/ — they show up here automatically.",
    library: "in library",
    light: "Light",
    dark: "Dark",
  },
} as const;

type Dict = typeof dict.en;
type Key = keyof Dict;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("app.lang")) as Lang | null;
    if (saved === "zh" || saved === "en") {
      setLangState(saved);
    } else if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("zh")) {
      setLangState("zh");
    } else {
      setLangState("en");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("app.lang", l);
  };

  const t = (k: Key) => dict[lang][k];

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}