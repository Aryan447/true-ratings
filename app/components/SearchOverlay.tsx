"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchResult } from "../types";
import { searchSeries } from "../actions/getSeriesData";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

interface SearchOverlayProps {
    onSearch: (query: string) => void;
    loading: boolean;
    hasSearched: boolean;
}

const MAX_RECENT_SEARCHES = 3;

export default function SearchOverlay({ onSearch, loading, hasSearched }: SearchOverlayProps) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Load recent searches on mount
    useEffect(() => {
        const saved = localStorage.getItem("failed_follies_recent");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Helper to save search to history
    const addToHistory = (term: string) => {
        const newHistory = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT_SEARCHES);
        setRecentSearches(newHistory);
        localStorage.setItem("failed_follies_recent", JSON.stringify(newHistory));
    };

    const clearHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRecentSearches([]);
        localStorage.removeItem("failed_follies_recent");
    };

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                // Don't hide dropdown here if we want to show recent searches when empty
                // But usually we show recent only on focus when empty.
            } else {
                const data = await searchSeries(query);
                setResults(data);
                setShowDropdown(true);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Handle clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const executeSearch = (term: string) => {
        if (!term.trim()) return;
        addToHistory(term);
        setQuery(term);
        setShowDropdown(false);
        onSearch(term);
    };

    const handleSelect = (title: string) => {
        executeSearch(title);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            executeSearch(query);
        }
        if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    // Keyboard shortcut to focus
    useEffect(() => {
        const handleGlobalKey = (e: KeyboardEvent) => {
            if (e.key === "/" && !hasSearched) { // Simple '/' might conflict if typed fast, check modifiers if needed
                // e.preventDefault(); // can be annoying in inputs
            }
        };
        window.addEventListener("keydown", handleGlobalKey);
        return () => window.removeEventListener("keydown", handleGlobalKey);
    }, [hasSearched]);


    const router = useRouter();

    // Dynamic classes based on state (Centered Hero vs Top Bar)
    const containerClasses = hasSearched
        ? "w-full max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center gap-4 transition-all duration-500 md:pr-40 lg:pr-72"
        : "flex flex-col items-center justify-center min-h-[50vh] text-center px-6 w-full relative z-20 transition-all duration-500";

    // Retro Marquee Logic
    const isRetro = theme === 'retro';

    return (
        <div className={containerClasses} ref={searchContainerRef}>

            {/* Header / Logo Section */}
            {!hasSearched && (
                <>
                    {isRetro ? (
                        /* Classic Cinema Header */
                        <div className="mb-10 text-center relative p-4 md:p-8 border-4 border-yellow-500 bg-black shadow-[0_0_30px_rgba(239,68,68,0.5)] w-full max-w-2xl">
                            <div className="absolute top-0 left-0 w-full h-full border border-dashed border-red-500 opacity-50 pointer-events-none"></div>
                            <h1 className="text-3xl md:text-7xl font-bold text-yellow-500 tracking-widest font-mono uppercase drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
                                {t.nowShowing}
                            </h1>
                            <p className="text-red-500 mt-2 font-mono tracking-widest text-sm md:text-base">{t.trueRatingsCinema}</p>

                            {/* Marquee Bulbs */}
                            <div className="hidden md:block absolute -top-3 left-10 w-4 h-4 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_10px_yellow]"></div>
                            <div className="hidden md:block absolute -top-3 right-10 w-4 h-4 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_10px_yellow]"></div>
                            <div className="hidden md:block absolute -bottom-3 left-10 w-4 h-4 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_10px_yellow]"></div>
                            <div className="hidden md:block absolute -bottom-3 right-10 w-4 h-4 rounded-full bg-yellow-200 animate-pulse shadow-[0_0_10px_yellow]"></div>
                        </div>
                    ) : (
                        /* Modern Header */
                        <div className="mb-8 w-full">
                            <h1 className="text-5xl md:text-8xl font-bold mb-4 md:mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 animate-fade-in">
                                {t.websiteTitle}
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl font-light max-w-lg mx-auto animate-fade-in">
                                {t.websiteSubtitle}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Logo in Top Bar mode */}
            {hasSearched && (
                <div
                    className={`text-2xl font-bold cursor-pointer mb-4 md:mb-0 md:mr-4 flex-shrink-0 ${isRetro ? 'text-yellow-500 font-mono' : 'text-gradient'}`}
                    onClick={() => {
                        router.push('/');
                    }}
                >
                    {isRetro ? "TR CINEMA" : "True Ratings"}
                </div>
            )}

            {/* Search Input Container */}
            <div className={hasSearched ? "relative w-full md:flex-1" : "relative w-full max-w-2xl group"}>
                {/* Glow effect only in Hero mode (Modern) */}
                {!hasSearched && !isRetro && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700" />
                )}

                <div className={`relative flex overflow-visible transition-all duration-300 z-50
                    ${isRetro
                        ? 'bg-black border-2 border-yellow-500 shadow-[4px_4px_0px_#ef4444]'
                        : 'glass bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl'}
                    ${hasSearched && !isRetro ? 'rounded-lg' : ''}
                `}>
                    <input
                        className={`w-full bg-transparent outline-none font-light 
                            ${isRetro ? 'text-yellow-500 placeholder-red-900 font-mono text-lg md:text-xl px-4 md:px-6 py-3 md:py-4' : 'text-white placeholder-gray-500 text-base md:text-xl px-5 md:px-8 py-3 md:py-5'}
                            ${hasSearched && !isRetro ? 'px-4 py-3 text-base md:text-lg' : ''}
                        `}
                        placeholder={isRetro ? t.insertTitle : t.searchPlaceholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowDropdown(true)}
                    />
                    <button
                        onClick={() => executeSearch(query)}
                        disabled={loading}
                        className={`font-medium bg-white/5 hover:bg-white/10 transition-colors border-l border-white/5 disabled:opacity-50 text-gray-300 hover:text-white ${hasSearched ? 'px-4' : 'px-6 md:px-8'}`}
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        ) : (
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </button>

                    {/* Autocomplete & History Dropdown */}
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/20 rounded-xl overflow-hidden shadow-2xl z-[100] max-h-[60vh] overflow-y-auto animate-fade-in">
                            {/* Live Results */}
                            {results.length > 0 ? (
                                results.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                        onClick={() => handleSelect(item.title)}
                                    >
                                        <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {item.poster && <img src={item.poster} className="w-full h-full object-cover" alt="" />}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className="text-white font-medium text-sm md:text-base">{item.title}</h4>
                                            <div className="text-xs text-gray-400">{item.year} • {item.rating} ★</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Recent Searches (only if no query or no results) */
                                query.length < 2 && recentSearches.length > 0 && (
                                    <div className="p-2">
                                        <div className="flex justify-between items-center px-2 py-1 mb-1">
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</span>
                                            <button onClick={clearHistory} className="text-[10px] text-red-400 hover:text-red-300">CLEAR</button>
                                        </div>
                                        {recentSearches.map((term, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 p-2 hover:bg-white/5 cursor-pointer rounded-lg transition-colors"
                                                onClick={() => executeSearch(term)}
                                            >
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-300 text-sm">{term}</span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
