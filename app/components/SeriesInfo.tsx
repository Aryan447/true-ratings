"use client";
import React from "react";

interface SeriesInfoProps {
    series: any;
    globalBest: { season: number; ep: any } | null;
    globalWorst: { season: number; ep: any } | null;
}

export default function SeriesInfo({ series, globalBest, globalWorst }: SeriesInfoProps) {
    return (
        <div className="retro-box p-6 md:p-8 mb-12 flex flex-col md:flex-row gap-8 items-start relative z-10 w-full max-w-6xl mx-auto bg-black border-2 border-[var(--neon-cyan)] animate-fade-in">
            <div className="relative">
                <img
                    src={series.Poster}
                    alt={series.Title}
                    className="w-full md:w-64 border-2 border-white opacity-80 contrast-125 sepia hover:sepia-0 transition-all duration-500"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white font-bold px-2 py-0.5 text-xs animate-pulse">REC</div>
            </div>

            <div className="flex-1 font-mono">
                <div className="flex flex-wrap items-baseline gap-4 mb-4 border-b-2 border-dashed border-[var(--neon-pink)] pb-2">
                    <h2 className="text-4xl font-bold text-[var(--neon-yellow)] uppercase tracking-widest text-shadow-retro">
                        {series.Title}
                    </h2>
                    <span className="bg-[var(--neon-pink)] text-black px-3 py-1 font-bold text-sm">
                        {series.Year}
                    </span>
                </div>

                <p className="text-[var(--neon-cyan)] mb-6 max-w-2xl leading-relaxed tracking-wider uppercase">
                    {series.Plot}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-[#111] px-5 py-3 border border-[var(--neon-yellow)] shadow-[0_0_10px_rgba(255,204,0,0.3)]">
                        <span className="block text-xs text-gray-500 uppercase tracking-widest font-bold">RATING_DB</span>
                        <span className="text-2xl font-bold text-[var(--neon-yellow)]">
                            {series.imdbRating} <span className="text-sm text-gray-400 font-normal">({series.imdbVotes})</span>
                        </span>
                    </div>

                    {globalBest && (
                        <div className="bg-[#001a00] px-5 py-3 border border-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.3)]">
                            <span className="block text-xs text-[#00ff00] uppercase tracking-widest font-bold">HIGH_SCORE</span>
                            <div className="font-semibold text-green-200 truncate max-w-[200px]" title={globalBest.ep.Title}>
                                S{globalBest.season}E{globalBest.ep.Episode}: {globalBest.ep.Title}
                            </div>
                            <span className="text-xl font-bold text-[#00ff00]">{globalBest.ep.imdbRating}</span>
                        </div>
                    )}

                    {globalWorst && (
                        <div className="bg-[#1a0000] px-5 py-3 border border-[#ff0000] shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                            <span className="block text-xs text-[#ff0000] uppercase tracking-widest font-bold">CRITICAL_FAIL</span>
                            <div className="font-semibold text-red-200 truncate max-w-[200px]" title={globalWorst.ep.Title}>
                                S{globalWorst.season}E{globalWorst.ep.Episode}: {globalWorst.ep.Title}
                            </div>
                            <span className="text-xl font-bold text-[#ff0000]">{globalWorst.ep.imdbRating}</span>
                        </div>
                    )}
                </div>

                <a
                    href={`https://www.imdb.com/title/${series.imdbID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 border-2 border-[var(--neon-pink)] text-[var(--neon-pink)] hover:bg-[var(--neon-pink)] hover:text-black transition-colors font-bold uppercase tracking-widest"
                >
                    [ ACCESS IMDB DATA ]
                </a>
            </div>
        </div>
    );
}
