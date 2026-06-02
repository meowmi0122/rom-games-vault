import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl animate-flicker">🕹️</span>
          <span className="text-sm text-neon-pink" style={{ fontFamily: "Press Start 2P, monospace" }}>
            ARCADE VAULT
          </span>
        </Link>
        <nav className="text-xs text-muted-foreground" style={{ fontFamily: "Press Start 2P, monospace" }}>
          <Link to="/" className="hover:text-neon-cyan">HOME</Link>
        </nav>
      </div>
    </header>
  );
}