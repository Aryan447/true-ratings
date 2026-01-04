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

const getColor = (r: number) => {
    // Liquid Gradient backgrounds for ratings
    if (r >= 9.0) return "bg-emerald-500/20 border-emerald-500/30 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
    if (r >= 8.5) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-300";
    if (r >= 8.0) return "bg-cyan-500/10 border-cyan-500/20 text-cyan-300";
    if (r >= 7.0) return "bg-blue-500/10 border-blue-500/20 text-blue-300";
    if (r >= 6.0) return "bg-purple-500/10 border-purple-500/20 text-purple-300";
    return "bg-rose-500/10 border-rose-500/20 text-rose-300";
};

export default function EpisodeGrid({ seasons, globalBest, globalWorst }: EpisodeGridProps) {
    const getSeasonAvg = (episodes: Episode[]) => {
        const ratings = episodes.map(e => parseFloat(e.imdbRating)).filter(r => !isNaN(r));
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";
    };

    return (
        <div className="space-y-16 w-full max-w-7xl mx-auto px-6 pb-20">
            {Object.entries(seasons).map(([season, episodes]) => {
                const avg = getSeasonAvg(episodes);
                return (
                    <div key={season} className="animate-fade-in relative">
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-10 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent"></div>

                        <div className="flex items-center gap-6 mb-8 relative z-10">
                            <h3 className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg">Season {season}</h3>
                            <div className="px-4 py-1 rounded-full liquid-card text-sm font-bold text-blue-200">
                                Avg {avg}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4 pl-0">
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
                        aspect-[1/1] rounded-[1.5rem] flex flex-col items-center justify-center text-center
                        transition-all duration-500 ease-spring group-hover:-translate-y-2 group-hover:scale-110
                        liquid-card border
                        ${invalid ? "bg-white/5 border-white/5" : getColor(rating)}
                        ${isBest ? "ring-2 ring-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)] bg-emerald-500/20" : ""}
                      `}
                                        >
                                            <div className="text-xs text-white/50 mb-0.5 font-medium">E{ep.Episode}</div>
                                            <div className="text-xl font-bold tracking-tight">{invalid ? "-" : rating.toFixed(1)}</div>
                                        </div>

                                        {/* Floating Glass Tooltip */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 liquid-card p-4 z-50 pointer-events-none text-left backdrop-blur-3xl bg-black/40">
                                            <div className="font-bold text-white text-md mb-2 leading-tight">{ep.Title}</div>
                                            <div className="flex justify-between items-center text-xs text-blue-200/70">
                                                <span>Episode {ep.Episode}</span>
                                                <span className="font-bold text-white">{rating} ★</span>
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
