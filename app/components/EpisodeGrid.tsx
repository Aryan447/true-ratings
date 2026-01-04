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

const getColorStyle = (r: number) => {
    if (r >= 9.0) return "border-[#00ff00] text-[#00ff00] shadow-[0_0_10px_#00ff00]";
    if (r >= 8.5) return "border-[#00cc00] text-[#00cc00]";
    if (r >= 8.0) return "border-[#009900] text-[#009900]";
    if (r >= 7.5) return "border-[#ffff00] text-[#ffff00]";
    if (r >= 7.0) return "border-[#cccc00] text-[#cccc00]";
    if (r >= 6.0) return "border-[#ff6600] text-[#ff6600]";
    return "border-[#ff0000] text-[#ff0000]";
};

export default function EpisodeGrid({ seasons, globalBest, globalWorst }: EpisodeGridProps) {
    const getSeasonAvg = (episodes: Episode[]) => {
        const ratings = episodes.map(e => parseFloat(e.imdbRating)).filter(r => !isNaN(r));
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";
    };

    return (
        <div className="space-y-8 w-full max-w-6xl mx-auto font-mono">
            {Object.entries(seasons).map(([season, episodes]) => {
                const avg = getSeasonAvg(episodes);
                return (
                    <div key={season} className="border-t-2 border-dashed border-[var(--foreground)] pt-6">
                        <div className="flex justify-between items-center mb-4 pb-2">
                            <h3 className="text-xl font-bold text-[var(--neon-pink)] uppercase tracking-widest">{">"} Season_0{season}</h3>
                            <div className="px-3 py-1 bg-black text-sm font-bold text-[var(--neon-yellow)] border border-[var(--neon-yellow)]">
                                AVG_RATING: {avg}
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
                                        className="relative group cursor-pointer"
                                    >
                                        <div
                                            className={`
                        aspect-square flex flex-col items-center justify-center text-center
                        border-2 bg-black hover:bg-white/10 transition-colors
                        ${invalid ? "border-gray-700 text-gray-500" : getColorStyle(rating)}
                        ${isBest ? "animate-pulse bg-[#00ff00]/10" : ""}
                      `}
                                        >
                                            <span className="text-xs font-bold mb-1">E{ep.Episode}</span>
                                            <span className="text-lg font-bold">{invalid ? "-" : rating.toFixed(1)}</span>
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-0 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border-2 border-[var(--neon-cyan)] p-2 z-50 pointer-events-none shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                                            <div className="font-bold text-[var(--neon-cyan)] mb-1 uppercase tracking-tighter line-clamp-2">{ep.Title}</div>
                                            <div className="text-xs text-white uppercase">Episode: {ep.Episode}</div>
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
