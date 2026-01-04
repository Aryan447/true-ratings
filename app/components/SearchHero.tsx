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
      <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
        <span className="text-gradient">True Ratings</span>
      </h1>
      <p className="text-gray-400 mb-8 text-lg max-w-md">
        Discover the highest and lowest rated episodes of your favorite TV series, visualized.
      </p>
      
      <div className="relative w-full max-w-xl group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
        <div className="relative flex glass rounded-xl overflow-hidden">
          <input 
            className="w-full bg-transparent px-6 py-4 outline-none text-lg placeholder-gray-500"
            placeholder="Search for a series (e.g., Breaking Bad)..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="px-8 font-semibold bg-white/5 hover:bg-white/10 transition-colors border-l border-white/5 disabled:opacity-50"
          >
           {loading ? "..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}
