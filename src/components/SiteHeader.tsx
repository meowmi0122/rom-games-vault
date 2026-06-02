import { Link } from "@tanstack/react-router";
import { Moon, Sun, Gamepad2 } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Gamepad2 className="text-primary" size={20} />
          <span className="text-base">{t("appName")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-border bg-card text-xs overflow-hidden">
            <button
              onClick={() => setLang("zh")}
              className={`px-2.5 py-1 transition ${lang === "zh" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              繁中
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              EN
            </button>
          </div>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}