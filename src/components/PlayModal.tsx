import { useEffect } from "react";
import { X, Cpu, Gamepad2 } from "lucide-react";
import type { Game } from "@/lib/games";
import { emulatorJsCore } from "@/lib/games";
import { useI18n } from "@/lib/i18n";

interface Props {
  game: Game | null;
  onClose: () => void;
}

export function PlayModal({ game, onClose }: Props) {
  const { t } = useI18n();

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
    const url = `https://romm.app/?rom=${encodeURIComponent(romUrl)}`;
    window.open(url, "_blank", "noopener");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="mb-1 text-base font-semibold">{t("selectEmulator")}</h2>
        <p className="mb-6 truncate text-sm text-muted-foreground">{game.name}</p>

        <div className="space-y-3">
          <button
            onClick={launchEmulatorJs}
            className="group flex w-full items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition hover:border-primary hover:bg-accent"
          >
            <Gamepad2 className="text-primary" size={28} />
            <div>
              <div className="text-sm font-medium">EmulatorJS</div>
              <div className="text-xs text-muted-foreground">{t("playInBrowser")}</div>
            </div>
          </button>

          <button
            onClick={launchRomM}
            className="group flex w-full items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition hover:border-primary hover:bg-accent"
          >
            <Cpu className="text-primary" size={28} />
            <div>
              <div className="text-sm font-medium">RomM</div>
              <div className="text-xs text-muted-foreground">{t("openInRomM")}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}