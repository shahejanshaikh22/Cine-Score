import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bookmark, Clapperboard, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function Layout({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { theme, toggle } = useTheme();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    if (q.trim()) {
      setLocation(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col bg-background text-foreground ${theme}`}>
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 text-foreground font-semibold text-base tracking-tight transition-opacity hover:opacity-70">
            <Clapperboard className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <span>CineScore</span>
          </Link>

          <div className="flex-1 max-w-sm mx-auto hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                name="q"
                type="search"
                placeholder="Search movies..."
                className="w-full h-9 bg-muted/40 border border-border/50 rounded pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
              />
            </form>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/watchlist" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors h-9 px-3">
              <Bookmark className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Watchlist</span>
            </Link>

            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center h-9 w-9 rounded text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-border/20 px-4 py-2 bg-background">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              name="q"
              type="search"
              placeholder="Search movies..."
              className="w-full h-9 bg-muted/40 border border-border/50 rounded pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </form>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border/20 py-10 mt-auto">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2 text-foreground/80 text-sm font-medium">
            <Clapperboard className="h-4 w-4 text-primary" strokeWidth={1.5} />
            CineScore
          </div>
          <p className="text-xs text-muted-foreground/60 max-w-md">
            Developed by Team CineScore &middot; B.Tech CSE Honours AIML &middot; Sage University, Bhopal
          </p>
          <p className="text-xs text-muted-foreground/40">
            Built for film enthusiasts, by film enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
}
