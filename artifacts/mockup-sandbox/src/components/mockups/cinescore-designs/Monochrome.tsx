import React from "react";
import { Clapperboard, Search, Star } from "lucide-react";

export function Monochrome() {
  const trendingMovies = [
    { title: "Dune: Part Two", year: "2024" },
    { title: "Oppenheimer", year: "2023" },
    { title: "Poor Things", year: "2023" },
    { title: "Killers of the Flower Moon", year: "2023" },
    { title: "Past Lives", year: "2023" },
    { title: "Anatomy of a Fall", year: "2023" },
  ];

  return (
    <div
      className="min-h-screen text-white font-sans selection:bg-white selection:text-black"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Navbar */}
      <header
        className="flex items-center justify-between px-8 py-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <Clapperboard size={24} strokeWidth={1.5} />
          <span className="text-xl font-medium tracking-widest uppercase">
            CineScore
          </span>
        </div>
        <nav>
          <a
            href="#"
            className="text-sm tracking-wider uppercase hover:opacity-70 transition-opacity"
          >
            Watchlist
          </a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-20 space-y-32">
        {/* Hero */}
        <section className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter leading-none">
              THE CINEMA <br /> RECORD.
            </h1>
            <p className="text-lg md:text-xl text-white/60 tracking-wide font-light max-w-2xl">
              A minimalist index of cinematic achievement. Search the database,
              find the consensus.
            </p>
          </div>

          <div
            className="flex items-center w-full max-w-xl transition-colors focus-within:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="pl-4 pr-3 py-4 text-white/50">
              <Search size={20} strokeWidth={1.5} />
            </div>
            <input
              type="text"
              placeholder="SEARCH BY TITLE, DIRECTOR, OR YEAR..."
              className="w-full bg-transparent border-none outline-none py-4 pr-4 text-sm tracking-widest uppercase placeholder:text-white/30"
            />
          </div>
        </section>

        {/* Pick of the Week */}
        <section className="space-y-8">
          <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-white/50 flex items-center gap-4">
            <span
              className="h-px bg-white/20 w-12 block"
              aria-hidden="true"
            ></span>
            Pick of the Week
          </h2>

          <div
            className="group block"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="flex flex-col md:flex-row h-auto md:h-[400px]">
              <div
                className="w-full md:w-1/3 p-8 flex items-center justify-center min-h-[300px]"
                style={{
                  backgroundColor: "#1a1a1a",
                  borderRight: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="text-center space-y-2 opacity-30">
                  <Clapperboard size={48} strokeWidth={1} className="mx-auto" />
                  <p className="text-xs tracking-widest uppercase">Poster</p>
                </div>
              </div>

              <div className="w-full md:w-2/3 p-12 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-light tracking-tight">
                      The Shawshank Redemption
                    </h3>
                    <p className="text-sm tracking-widest uppercase text-white/50">
                      1994 • Drama / Crime
                    </p>
                  </div>

                  <p className="text-lg text-white/80 font-light leading-relaxed max-w-xl">
                    Two imprisoned men bond over a number of years, finding solace
                    and eventual redemption through acts of common decency. A
                    masterpiece of quiet resilience.
                  </p>
                </div>

                <div className="flex items-end justify-between pt-12">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-white/40 mb-2">
                      CineScore
                    </p>
                    <div className="flex items-center gap-3">
                      <Star
                        size={28}
                        className="fill-white text-white"
                        strokeWidth={1}
                      />
                      <span className="text-5xl font-light tracking-tighter">
                        8.7
                      </span>
                    </div>
                  </div>
                  <button
                    className="px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="space-y-8">
          <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-white/50 flex items-center gap-4">
            <span
              className="h-px bg-white/20 w-12 block"
              aria-hidden="true"
            ></span>
            Trending Now
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {trendingMovies.map((movie, index) => (
              <div key={index} className="space-y-4 group cursor-pointer">
                <div
                  className="w-full aspect-[2/3] flex items-center justify-center transition-opacity group-hover:opacity-80"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  <span className="text-xs tracking-widest uppercase text-white/30">
                    No Image
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-light tracking-wide truncate">
                    {movie.title}
                  </h4>
                  <p className="text-xs tracking-widest uppercase text-white/50 mt-1">
                    {movie.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="py-12 mt-32 text-center"
        style={{ borderTop: "2px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Clapperboard size={20} strokeWidth={1} className="opacity-50" />
          <p className="text-xs tracking-widest uppercase text-white/40">
            © {new Date().getFullYear()} CineScore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
