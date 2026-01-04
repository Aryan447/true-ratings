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
    if (r >= 9.0) return "bg-green-500 shadow-[0_0_15px_-3px_rgba(34,197,94,0.6)]";
    if (r >= 8.5) return "bg-emerald-500";
    if (r >= 8.0) return "bg-green-600";
    if (r >= 7.5) return "bg-yellow-500";
    if (r >= 7.0) return "bg-yellow-600";
    if (r >= 6.0) return "bg-orange-600";
    return "bg-red-600";
};

export default function EpisodeGrid({ seasons, globalBest, globalWorst }: EpisodeGridProps) {
    const getSeasonAvg = (episodes: Episode[]) => {
        const ratings = episodes.map(e => parseFloat(e.imdbRating)).filter(r => !isNaN(r));
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";
    };

    return (
        <div className="space-y-8 w-full max-w-6xl mx-auto">
            {Object.entries(seasons).map(([season, episodes]) => {
                const avg = getSeasonAvg(episodes);
                return (
                    <div key={season} className="glass rounded-xl p-5 md:p-6 transition-all hover:bg-white/[0.07]">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white">Season {season}</h3>
                            <div className="px-3 py-1 rounded bg-black/40 text-sm font-mono text-yellow-400 border border-white/5">
                                Avg: {avg}
                            </div>
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
                                        className="relative group cursor-default"
                                    >
                                        <div
                                            className={`
                        aspect-square rounded-md flex flex-col items-center justify-center text-center
                        transition-transform duration-200 ease-out group-hover:scale-110 z-0 group-hover:z-10
                        ${invalid ? "bg-gray-800 text-gray-500" : `text-white font-bold ${getColor(rating)}`}
                        ${isBest ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-105 z-10" : ""}
                      `}
                                        >
                                            <span className="text-xs opacity-80 font-normal">E{ep.Episode}</span>
                                            <span className="text-lg leading-none">{invalid ? "-" : rating.toFixed(1)}</span>
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black/90 backdrop-blur-md border border-white/20 p-3 rounded-lg text-xs z-50 pointer-events-none shadow-2xl">
                                            <div className="font-bold text-white mb-1 line-clamp-2">{ep.Title}</div>
                                            <div className="text-gray-400">Episode: {ep.Episode}</div>
                                            {!invalid && <div className="text-yellow-400">Rating: {rating}</div>}
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
