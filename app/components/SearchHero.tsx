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
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 w-full relative">
      {/* Decorative Lights Top */}
      <div className="flex gap-4 mb-8">
        {[...Array(8)].map((_, i) => <div key={i} className="bulb" style={{ animationDelay: `${i * 0.1}s` }} />)}
      </div>

      <div className="cinema-border p-8 md:p-12 max-w-2xl w-full relative bg-[#1a0505]">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#c5a059] font-serif marquee-text border-b-4 border-double border-[#c5a059] pb-4 inline-block">
          NOW SHOWING
        </h1>
        <p className="text-[#f0e6d2] mb-8 text-xl font-serif italic text-opacity-80">
          "The Greatest Ratings on Earth"
        </p>

        <div className="flex flex-col md:flex-row gap-0 border-4 border-[#c5a059]">
          <input
            className="flex-1 bg-[#2a0808] text-[#f0e6d2] p-4 text-xl font-serif placeholder-[#8a5c5c] outline-none"
            placeholder="Type Movie Title..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-3 bg-[#8a0c0c] text-[#c5a059] font-bold text-lg hover:bg-[#a61313] transition-colors border-l-4 border-[#c5a059] uppercase tracking-widest"
          >
            {loading ? "Reeling..." : "Admit One"}
          </button>
        </div>
      </div>

      {/* Decorative Lights Bottom */}
      <div className="flex gap-4 mt-8">
        {[...Array(8)].map((_, i) => <div key={i} className="bulb" style={{ animationDelay: `${i * 0.1}s` }} />)}
      </div>
    </div>
  );
}
