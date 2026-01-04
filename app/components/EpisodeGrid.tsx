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
    if (r >= 9.0) return "bg-emerald-500";
    if (r >= 8.5) return "bg-emerald-600";
    if (r >= 8.0) return "bg-emerald-700";
    if (r >= 7.5) return "bg-yellow-600";
    if (r >= 7.0) return "bg-orange-600";
    if (r >= 6.0) return "bg-orange-700";
    return "bg-rose-700";
};

export default function EpisodeGrid({ seasons, globalBest, globalWorst }: EpisodeGridProps) {
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
                        <div className="flex items-baseline gap-4 mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-3xl font-bold text-white tracking-tight">Season {season}</h3>
                            <span className="text-xl text-gray-500 font-light">Avg {avg}</span>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                            {episodes.map((ep, i) => {
                                const rating = parseFloat(ep.imdbRating);
                                const isBest = globalBest?.ep.imdbID === ep.imdbID;
                                const isWorst = globalWorst?.ep.imdbID === ep.imdbID;
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
                        ${invalid ? "bg-gray-800/50" : getColor(rating)}
                        opacity-90 group-hover:opacity-100 shadow-lg group-hover:shadow-2xl
                        ${isBest ? "ring-2 ring-white" : ""}
                      `}
                                        >
                                            {/* Gradient Overlay for depth */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-lg"></div>

                                            <div className="relative z-10 w-full px-1">
                                                <div className="text-xs text-white/70 mb-1 font-medium">E{ep.Episode}</div>
                                                <div className="text-2xl font-bold text-white tracking-tight">{invalid ? "-" : rating.toFixed(1)}</div>
                                            </div>
                                        </div>

                                        {/* Minimal Tooltip */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-left">
                                            <div className="font-bold text-white text-sm mb-1 line-clamp-2">{ep.Title}</div>
                                            <div className="flex justify-between items-center text-xs text-gray-400">
                                                <span>Episode {ep.Episode}</span>
                                                <span className={!invalid ? "text-white font-bold" : ""}>{rating} ★</span>
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
