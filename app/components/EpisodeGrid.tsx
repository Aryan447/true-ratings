"use client";
import React from "react";

interface Episode {
    Episode: string;
    imdbRating: string;
    Title: string;
    imdbID: string;
}

interface EpisodeGridProps {
    seasons: { [key: number]: Episode[] };
    globalBest: { season: number; ep: Episode } | null;
    globalWorst: { season: number; ep: Episode } | null;
}

import { useTheme } from "../context/ThemeContext";

const getColor = (r: number, isRetro: boolean) => {
    if (isRetro) {
        // Red scale for retro
        if (r >= 8.5) return "bg-red-600 border-2 border-yellow-400"; // Hit
        if (r >= 7.0) return "bg-red-800 border border-red-900";     // Mid
        return "bg-black border border-red-900 text-red-700";        // Flop
    }
    if (r >= 9.0) return "bg-emerald-500";
    if (r >= 8.5) return "bg-emerald-600";
    if (r >= 8.0) return "bg-emerald-700";
    if (r >= 7.5) return "bg-yellow-600";
    if (r >= 7.0) return "bg-orange-600";
    if (r >= 6.0) return "bg-orange-700";
    return "bg-rose-700";
};

export default function EpisodeGrid({ seasons, globalBest, globalWorst }: EpisodeGridProps) {
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    const getSeasonAvg = (episodes: Episode[]) => {
        const ratings = episodes.map(e => parseFloat(e.imdbRating)).filter(r => !isNaN(r));
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";
    };

    return (
        <div className="space-y-12 w-full max-w-6xl mx-auto">
            {Object.entries(seasons).map(([season, episodes]) => {
                const avg = getSeasonAvg(episodes);
                return (
                    <div key={season} className="animate-fade-in">
                        <div className={`flex items-baseline gap-4 mb-6 pb-4 border-b 
                            ${isRetro ? 'border-red-800' : 'border-white/5'}`}>
                            <h3 className={`text-3xl font-bold tracking-tight 
                                ${isRetro ? 'text-yellow-500 font-mono uppercase tracking-widest' : 'text-white'}`}>
                                {isRetro ? `ACT ${season}` : `Season ${season}`}
                            </h3>
                            <span className={`text-xl font-light 
                                ${isRetro ? 'text-red-500 font-mono' : 'text-gray-500'}`}>Avg {avg}</span>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                            {episodes.map((ep, i) => {
                                const rating = parseFloat(ep.imdbRating);
                                const isBest = globalBest?.ep.imdbID === ep.imdbID;
                                const invalid = isNaN(rating);

                                return (
                                    <div
                                        key={i}
                                        className="relative group cursor-pointer"
                                    >
                                        <div
                                            className={`
                        aspect-[4/5] rounded-lg flex flex-col items-center justify-end pb-3 text-center
                        transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1
                        ${invalid ? "bg-gray-800/50" : getColor(rating, isRetro)}
                        opacity-90 group-hover:opacity-100 shadow-lg group-hover:shadow-2xl
                        ${isBest ? "ring-2 ring-white" : ""}
                        ${isRetro ? 'rounded-none' : ''} /* Boxy for retro */
                      `}
                                        >
                                            {/* Gradient Overlay for depth */}
                                            {!isRetro && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-lg"></div>}

                                            <div className="relative z-10 w-full px-1">
                                                <div className={`text-xs mb-1 font-medium ${isRetro ? 'text-yellow-200 font-mono' : 'text-white/70'}`}>E{ep.Episode}</div>
                                                <div className={`text-2xl font-bold tracking-tight ${isRetro ? 'text-yellow-400 font-mono' : 'text-white'}`}>
                                                    {invalid ? "-" : rating.toFixed(1)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tooltip */}
                                        <div className={`absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 rounded-xl shadow-2xl z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-left
                                            ${isRetro
                                                ? 'bg-red-900 border-2 border-yellow-500 rounded-none shadow-[4px_4px_0_#fbbf24]'
                                                : 'bg-black/90 backdrop-blur-xl border border-white/10'}`}>
                                            <div className={`font-bold text-sm mb-1 line-clamp-2 
                                                ${isRetro ? 'text-yellow-400 font-mono uppercase' : 'text-white'}`}>
                                                {ep.Title}
                                            </div>
                                            <div className={`flex justify-between items-center text-xs 
                                                ${isRetro ? 'text-yellow-200/70 font-mono' : 'text-gray-400'}`}>
                                                <span>Episode {ep.Episode}</span>
                                                <span className={!invalid ? (isRetro ? 'text-yellow-400 font-bold' : 'text-white font-bold') : ""}>{rating} ★</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
