import { useEffect, useState, useCallback } from "react";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useFavorites() {
  const KEY = "arcade.favorites";
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => setFavs(read<string[]>(KEY, [])), []);

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFav = useCallback((id: string) => favs.includes(id), [favs]);
  return { favs, toggle, isFav };
}

export function useRecent() {
  const KEY = "arcade.recent";
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => setRecent(read<string[]>(KEY, [])), []);

  const push = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 8);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recent, push };
}