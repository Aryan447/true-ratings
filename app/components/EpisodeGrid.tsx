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

export default function EpisodeGrid({ seasons, globalBest, globalWorst }: EpisodeGridProps) {
    const getSeasonAvg = (episodes: Episode[]) => {
        const ratings = episodes.map(e => parseFloat(e.imdbRating)).filter(r => !isNaN(r));
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";
    };

    return (
        <div className="space-y-12 w-full max-w-6xl mx-auto font-serif">
            {Object.entries(seasons).map(([season, episodes]) => {
                const avg = getSeasonAvg(episodes);
                return (
                    <div key={season} className="relative">
                        <h3 className="text-3xl font-bold text-[#c5a059] mb-4 pl-4 border-l-4 border-[#8a0c0c]">
                            Act {season} <span className="text-sm font-normal text-[#f0e6d2] italic ml-4">(Avg: {avg})</span>
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
                                            <span className="text-[10px] font-bold border-t border-black pt-1">SCENE {ep.Episode}</span>
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
