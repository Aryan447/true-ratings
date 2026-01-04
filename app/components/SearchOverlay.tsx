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

    // Retro Marquee Logic
    const isRetro = theme === 'retro';

    return (
        <div className={containerClasses}>
            {/* Theme Toggle Button (Top Right) */}
            <button
                onClick={toggleTheme}
                className={`fixed top-4 right-4 z-[100] px-4 py-2 rounded-full font-bold text-xs uppercase transition-all 
                    ${isRetro ? 'bg-yellow-500 text-black border-2 border-red-500 hover:scale-105' : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'}`}
            >
                {isRetro ? "Switch to Modern" : "Switch to Retro"}
            </button>

            {!hasSearched && (
                <>
                    {isRetro ? (
                        /* Classic Cinema Header */
                        <div className="mb-10 text-center relative p-8 border-4 border-yellow-500 bg-black shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                            <div className="absolute top-0 left-0 w-full h-full border border-dashed border-red-500 opacity-50 pointer-events-none"></div>
                            <h1 className="text-5xl md:text-7xl font-bold text-yellow-500 tracking-widest font-mono uppercase drop-shadow-md">
                                NOW SHOWING
                            </h1>
                            <p className="text-red-500 mt-2 font-mono tracking-widest">TRUE RATINGS CINEMA</p>

                            {/* Marquee Bulbs */}
                            <div className="absolute -top-3 left-10 w-4 h-4 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_10px_yellow]"></div>
                            <div className="absolute -top-3 right-10 w-4 h-4 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_10px_yellow]"></div>
                            <div className="absolute -bottom-3 left-10 w-4 h-4 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_10px_yellow]"></div>
                            <div className="absolute -bottom-3 right-10 w-4 h-4 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_10px_yellow]"></div>
                        </div>
                    ) : (
                        /* Modern Header */
                        <>
                            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 animate-fade-in">
                                True Ratings
                            </h1>
                            <p className="text-gray-400 mb-10 text-xl font-light max-w-lg get-started animate-fade-in">
                                Discover the real ratings of every episode.
                            </p>
                        </>
                    )}
                </>
            )}

            {hasSearched && (
                <div
                    className={`text-2xl font-bold cursor-pointer mr-4 ${isRetro ? 'text-yellow-500 font-mono' : 'text-gradient'}`}
                    onClick={() => window.location.reload()}
                >
                    {isRetro ? "TR CINEMA" : "True Ratings"}
                </div>
            )}

            <div className={hasSearched ? "relative flex-1" : "relative w-full max-w-2xl group"}>
                {/* Glow effect only in Hero mode (Modern) */}
                {!hasSearched && !isRetro && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700" />
                )}

                {/* Search Input Container */}
                <div className={`relative flex overflow-visible transition-all duration-300 z-50
                    ${isRetro
                        ? 'bg-black border-2 border-yellow-500 shadow-[4px_4px_0px_#ef4444]'
                        : 'glass bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl' /* Darker, Opaque Background for Modern UI */}
                    ${hasSearched && !isRetro ? 'rounded-lg' : ''}
                `}>
                    <input
                        className={`w-full bg-transparent outline-none font-light 
                            ${isRetro ? 'text-yellow-500 placeholder-red-900 font-mono text-xl px-6 py-4' : 'text-white placeholder-gray-500 text-xl px-8 py-5'}
                            ${hasSearched && !isRetro ? 'px-4 py-3 text-lg' : ''}
                        `}
                        placeholder={isRetro ? "INSERT TITLE HERE..." : "Search for a series..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query.length >= 2 && setShowDropdown(true)}
                    // onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delayed blur to allow clicks
                    />
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
