"use client";
import React, { useRef } from "react";

import { Episode } from "../types";

interface EpisodeGridProps {
    seasons: { [key: number]: Episode[] };
    globalBest: { season: number; ep: Episode } | null;
    globalWorst: { season: number; ep: Episode } | null;
}

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function EpisodeGrid({ seasons, globalBest, globalWorst }: EpisodeGridProps) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const isRetro = theme === 'retro';
    const seasonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const getSeasonAvg = (episodes: Episode[]) => {
        const ratings = episodes.map(e => parseFloat(e.imdbRating)).filter(r => !isNaN(r));
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";
    };

    const scrollToSeason = (season: string) => {
        const element = seasonRefs.current[season];
        if (element) {
            const yOffset = -100; // Offset for sticky header
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto relative">
            {/* Season Navigation Bar */}
            {!isRetro && (
                <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md py-4 mb-8 border-b border-white/10 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2 px-4 whitespace-nowrap">
                        {Object.keys(seasons).map((season) => (
                            <button
                                key={season}
                                onClick={() => scrollToSeason(season)}
                                className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white"
                            >
                                {t.season} {season}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-12">
                {Object.entries(seasons).map(([season, episodes]) => {
                    const avg = getSeasonAvg(episodes);
                    return (
                        <div
                            key={season}
                            className="animate-fade-in scroll-mt-24"
                            ref={(el) => { seasonRefs.current[season] = el; }}
                        >
                            {isRetro ? (
                                // Retro Layout
                                <div className="relative">
                                    <h3 className="text-3xl font-bold text-[#c5a059] mb-4 pl-4 border-l-4 border-[#8a0c0c] font-mono tracking-widest uppercase">
                                        {t.act} {season} <span className="text-sm font-normal text-[#f0e6d2] italic ml-4">({t.avg}: {avg})</span>
                                    </h3>

                                    {/* Film Strip Container */}
                                    <div className="bg-black py-4 px-2 overflow-x-auto flex gap-4 border-t-8 border-b-8 border-dashed border-[#333] relative">
                                        {episodes.map((ep, i) => {
                                            const rating = parseFloat(ep.imdbRating);
                                            const invalid = isNaN(rating);

                                            return (
                                                <div
                                                    key={i}
                                                    className="flex-shrink-0 w-32 bg-[#e6dcc3] text-black p-2 rounded-sm shadow-md relative group cursor-pointer hover:sepia transition-all"
                                                >
                                                    {/* Sprocket Holes simulation via CSS border/dots? Kept simple for now */}
                                                    <div className="border border-black h-full p-2 flex flex-col justify-between text-center relative">
                                                        <span className="font-bold text-xs uppercase tracking-tighter mb-1 line-clamp-1">{ep.Title}</span>
                                                        <div className="my-2 text-2xl font-bold font-mono">{invalid ? "-" : rating.toFixed(1)}</div>
                                                        <span className="text-[10px] font-bold border-t border-black pt-1">{t.scene} {ep.Episode}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                // Modern Layout
                                <>
                                    <div className={`flex items-baseline gap-4 mb-6 pb-4 border-b border-white/5`}>
                                        <h3 className={`text-3xl font-bold tracking-tight text-white`}>
                                            {t.season} {season}
                                        </h3>
                                        <span className={`text-xl font-light text-gray-500`}>{t.avg} {avg}</span>
                                    </div>

                                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
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
                                                            aspect-[3/4] rounded-md flex flex-col items-center justify-end pb-2 text-center
                                                            transition-all duration-300 ease-out group-hover:scale-110 group-hover:z-10
                                                            ${invalid ? "bg-gray-800/50" : getColor(rating, isRetro)}
                                                            opacity-90 group-hover:opacity-100 shadow-md group-hover:shadow-xl
                                                            ${isBest ? "ring-1 ring-white" : ""}
                                                        `}
                                                    >
                                                        {/* Gradient Overlay for depth */}
                                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-md"></div>

                                                        <div className="relative z-10 w-full px-0.5">
                                                            <div className={`text-[10px] mb-0.5 font-medium text-white/70`}>E{ep.Episode}</div>
                                                            <div className={`text-xl font-bold tracking-tight text-white`}>
                                                                {invalid ? "-" : rating.toFixed(1)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tooltip */}
                                                    <div className={`absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-lg shadow-xl z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-left bg-black/90 backdrop-blur-xl border border-white/10`}>
                                                        <div className={`font-bold text-xs mb-1 line-clamp-2 text-white`}>
                                                            {ep.Title}
                                                        </div>
                                                        <div className={`flex justify-between items-center text-[10px] text-gray-400`}>
                                                            <span>{t.episode} {ep.Episode}</span>
                                                            <span className={!invalid ? 'text-white font-bold' : ""}>{rating} ★</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

