import { useEffect } from "react";
import { X, Cpu, Gamepad2 } from "lucide-react";
import type { Game } from "@/lib/games";
import { emulatorJsCore } from "@/lib/games";

interface Props {
  game: Game | null;
  onClose: () => void;
}

export function PlayModal({ game, onClose }: Props) {
  useEffect(() => {
    if (!game) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game, onClose]);

  if (!game) return null;

  const romUrl =
    typeof window !== "undefined" ? window.location.origin + game.rom : game.rom;

  const launchEmulatorJs = () => {
    const core = emulatorJsCore(game.platform);
    const url = `/play/${game.platform}/${game.slug}?core=${core}`;
    window.open(url, "_blank", "noopener");
    onClose();
  };

  const launchRomM = () => {
    // Open RomM web library with the ROM URL as a query hint.
    const url = `https://romm.app/?rom=${encodeURIComponent(romUrl)}`;
    window.open(url, "_blank", "noopener");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-lg border-2 border-border bg-card p-6 glow-pink scanlines"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="text-neon-pink mb-1 text-sm">SELECT EMULATOR</h2>
        <p className="mb-6 truncate text-base text-muted-foreground" style={{ fontFamily: "VT323, monospace", fontSize: "1.1rem" }}>
          {game.name}
        </p>

        <div className="space-y-3">
          <button
            onClick={launchEmulatorJs}
            className="group flex w-full items-center gap-4 rounded border-2 border-border bg-background/60 p-4 text-left transition hover:border-[var(--neon-cyan)] hover:glow-cyan"
          >
            <Gamepad2 className="text-neon-cyan" size={32} />
            <div>
              <div className="text-sm text-neon-cyan" style={{ fontFamily: "Press Start 2P, monospace" }}>EmulatorJS</div>
              <div className="text-sm text-muted-foreground" style={{ fontFamily: "VT323, monospace", fontSize: "1rem" }}>
                Play instantly in the browser
              </div>
            </div>
          </button>

          <button
            onClick={launchRomM}
            className="group flex w-full items-center gap-4 rounded border-2 border-border bg-background/60 p-4 text-left transition hover:border-[var(--neon-pink)] hover:glow-pink"
          >
            <Cpu className="text-neon-pink" size={32} />
            <div>
              <div className="text-sm text-neon-pink" style={{ fontFamily: "Press Start 2P, monospace" }}>RomM</div>
              <div className="text-sm text-muted-foreground" style={{ fontFamily: "VT323, monospace", fontSize: "1rem" }}>
                Open in your RomM library
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}