"use client";
import React, { useState, useEffect, useRef } from "react";
import { searchSeries } from "../actions/getSeriesData";
import { useTheme } from "../context/ThemeContext";

interface SearchOverlayProps {
    onSearch: (query: string) => void;
    loading: boolean;
    hasSearched: boolean;
}

export default function SearchOverlay({ onSearch, loading, hasSearched }: SearchOverlayProps) {
    const { theme, toggleTheme } = useTheme();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            const data = await searchSeries(query);
            setResults(data);
            setShowDropdown(true);
        }, 300); // 300ms debounce
    }, [query]);

    const handleSelect = (title: string) => {
        setQuery(title);
        setShowDropdown(false);
        onSearch(title);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            setShowDropdown(false);
            onSearch(query);
        }
    };

    // Dynamic classes based on state (Centered Hero vs Top Bar)
    const containerClasses = hasSearched
        ? "w-full max-w-6xl mx-auto mb-8 flex items-center gap-4 transition-all duration-500"
        : "flex flex-col items-center justify-center min-h-[50vh] text-center px-6 w-full relative z-20 transition-all duration-500";

    const inputContainerClasses = hasSearched
        ? "relative flex-1"
        : "relative w-full max-w-2xl group";

    // Retro Marquee Logic
    const isRetro = theme === 'retro';

    return (
        <div className={containerClasses}>
            {!hasSearched && (
                <div className="flex flex-col items-center animate-fade-in">
                    <h1 className="text-7xl md:text-9xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 animate-float drop-shadow-2xl">
                        Pure Glass
                    </h1>
                    <p className="text-blue-200/80 mb-12 text-xl font-light tracking-wide max-w-lg backdrop-blur-sm py-2 px-6 rounded-full border border-white/5 bg-black/10">
                        True Ratings. Crystal Clear.
                    </p>
                </div>
            )}

            {hasSearched && (
                <div
                    className="text-2xl font-bold cursor-pointer text-white/90 hover:text-white mr-6 transition-colors tracking-tight"
                    onClick={() => window.location.reload()}
                >
                    Pure Glass
                </div>
            )}

            <div className={inputContainerClasses}>
                <div className={`relative transition-all duration-500 z-50 ${hasSearched ? '' : 'hover:scale-105'}`}>
                    {/* Outer Glow */}
                    {!hasSearched && <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-xl opacity-50 animate-pulse"></div>}

                    <div className={`relative flex items-center liquid-input overflow-hidden ${hasSearched ? 'rounded-2xl' : 'rounded-full h-16'}`}>
                        <input
                            className={`w-full bg-transparent outline-none text-white placeholder-white/40 font-light 
                ${hasSearched ? 'px-6 py-3 text-lg' : 'px-8 text-2xl h-full'}`}
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus={!hasSearched}
                        />
                        {!hasSearched && (
                            <div className="pr-6 text-white/30">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        )}
                    </div>
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && setShowDropdown(true)}
                    // onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delayed blur to allow clicks
                    <button
                        onClick={() => handleSelect(query)}
                        disabled={loading}
                        className={`font-medium bg-white/5 hover:bg-white/10 transition-colors border-l border-white/5 disabled:opacity-50 text-gray-300 hover:text-white ${hasSearched ? 'px-4' : 'px-8'}`}
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </button>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in">
                            {results.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                    onClick={() => handleSelect(item.title)}
                                >
                                    <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                        {item.poster && <img src={item.poster} className="w-full h-full object-cover" alt="" />}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="text-white font-medium">{item.title}</h4>
                                        <div className="text-xs text-gray-400">{item.year} • {item.rating} ★</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
