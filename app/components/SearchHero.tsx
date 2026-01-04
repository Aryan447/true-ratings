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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 w-full relative z-10">
      <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
        True Ratings
      </h1>
      <p className="text-gray-400 mb-10 text-xl font-light max-w-lg">
        The definitive source for TV series analytics.
      </p>

      <div className="relative w-full max-w-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700" />
        <div className="relative flex glass rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
          <input
            className="w-full bg-transparent px-8 py-5 outline-none text-xl text-white placeholder-gray-600 font-light"
            placeholder="Search for a series..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 font-medium bg-white/5 hover:bg-white/10 transition-colors border-l border-white/5 disabled:opacity-50 text-gray-300 hover:text-white"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
