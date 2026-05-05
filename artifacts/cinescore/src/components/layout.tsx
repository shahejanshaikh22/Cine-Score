import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bookmark, Clapperboard } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    if (q.trim()) {
      setLocation(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-black text-xl tracking-tight transition-opacity hover:opacity-80">
            <Clapperboard className="h-6 w-6" />
            <span>CineScore</span>
          </Link>

          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                name="q"
                type="search"
                placeholder="Search movies..."
                className="w-full h-10 bg-muted/50 border border-border rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/watchlist" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Watchlist</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden border-t border-border/40 p-2 px-4 bg-background">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              type="search"
              placeholder="Search movies..."
              className="w-full h-10 bg-muted/50 border border-border rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </form>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-primary/20 py-10 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-primary font-black text-lg tracking-tight">
            <Clapperboard className="h-5 w-5" />
            CineScore
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Developed by Team CineScore | B.Tech CSE Honours AIML | Sage University, Bhopal
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built for film enthusiasts, by film enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
}
