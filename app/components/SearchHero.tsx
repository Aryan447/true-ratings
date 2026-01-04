"use client";
import React from "react";

interface SearchHeroProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export default function SearchHero({ onSearch, loading }: SearchHeroProps) {
  const [value, setValue] = React.useState("");

  const handleSearch = () => {
    if (value.trim()) onSearch(value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 w-full">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-widest uppercase text-retro flicker-animation">
        TRUE RATINGS v1.0
      </h1>
      <p className="text-retro-cyan mb-8 text-lg font-mono tracking-wider">
        INSERT COIN TO CONTINUE... OR SEARCH SERIES
      </p>

      <div className="relative w-full max-w-xl group">
        <div className="retro-box p-2">
          <div className="flex items-center gap-2">
            <span className="text-neon-pink text-xl font-bold">{">"}</span>
            <input
              className="w-full bg-transparent p-2 outline-none text-lg text-neon-pink font-mono placeholder-pink-900 border-none focus:ring-0"
              placeholder="ENTER_SERIES_NAME_"
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              autoFocus
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-6 px-8 py-3 bg-neon-cyan text-black font-bold tracking-widest hover:bg-white hover:text-black hover:shadow-[0_0_15px_#00ffff] transition-all border-2 border-neon-cyan uppercase"
        >
          {loading ? "LOADING..." : "EXECUTE"}
        </button>
      </div>
    </div>
  );
}
