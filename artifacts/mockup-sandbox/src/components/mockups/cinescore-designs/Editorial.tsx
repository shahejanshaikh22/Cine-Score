import { Clapperboard, Search } from "lucide-react";

export function Editorial() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#f8f7f4", color: "#111111" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#ddd]">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-6 h-6" />
          <span className="text-xl font-bold font-['Playfair_Display']">CineScore</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <a href="#" className="hover:text-black" style={{ color: "#555" }}>Watchlist</a>
          <div className="w-8 h-8 rounded-full bg-[#ede9e0] flex items-center justify-center">
            <span className="text-xs font-bold">U</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-20">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] leading-tight">
              The Definitive Guide to Cinema.
            </h1>
            <p className="text-lg md:text-xl" style={{ color: "#555" }}>
              Curated ratings, editorial reviews, and trusted recommendations for the discerning film lover.
            </p>
          </div>
          
          <div className="w-full max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for movies, directors, or genres..." 
              className="w-full pl-12 pr-4 py-4 rounded bg-[#ede9e0] border border-transparent focus:bg-white focus:border-[#111111] outline-none transition-colors duration-200"
            />
          </div>
        </section>

        {/* Pick of the Week */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#888" }}>
            Pick of the Week
          </h2>
          
          <div className="flex flex-col md:flex-row bg-white border border-[#ddd] overflow-hidden">
            <div className="w-full md:w-1/3 aspect-[3/4] md:aspect-auto">
              <img 
                src="/__mockup/images/shawshank.png" 
                alt="The Shawshank Redemption" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center flex-1 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm font-medium" style={{ color: "#555" }}>
                  <span>1994</span>
                  <span className="w-1 h-1 rounded-full bg-[#ddd]"></span>
                  <span>Drama / Crime</span>
                </div>
                <h3 className="text-3xl font-['Playfair_Display']">The Shawshank Redemption</h3>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">8.7</span>
                <span className="text-sm font-medium uppercase tracking-wider" style={{ color: "#888" }}>CineScore</span>
              </div>
              
              <p className="leading-relaxed" style={{ color: "#555" }}>
                Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. A masterclass in storytelling that remains timeless.
              </p>
              
              <div>
                <button className="px-6 py-3 bg-[#111111] text-white text-sm font-medium hover:bg-black transition-colors">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#888" }}>
              Trending Now
            </h2>
            <a href="#" className="text-xs font-bold tracking-wider uppercase hover:underline" style={{ color: "#111111" }}>
              View All
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {[
              { title: "Dune: Part Two", year: "2024", score: "8.8" },
              { title: "Poor Things", year: "2023", score: "8.3" },
              { title: "Oppenheimer", year: "2023", score: "8.5" },
              { title: "Past Lives", year: "2023", score: "8.0" },
              { title: "Anatomy of a Fall", year: "2023", score: "7.8" },
              { title: "Perfect Days", year: "2023", score: "7.9" }
            ].map((movie, i) => (
              <div key={i} className="flex flex-col gap-4 group cursor-pointer">
                <div className="aspect-[2/3] w-full bg-[#ede9e0] transition-opacity group-hover:opacity-80"></div>
                <div className="space-y-1">
                  <h4 className="font-medium text-lg leading-tight group-hover:underline">{movie.title}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#555" }}>{movie.year}</span>
                    <span className="font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#111111]"></span>
                      {movie.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#ddd] py-8 text-center text-sm" style={{ color: "#888" }}>
        <p>&copy; {new Date().getFullYear()} CineScore Editorial. All rights reserved.</p>
      </footer>
    </div>
  );
}
