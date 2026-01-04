"use client";
import React from "react";

interface SeriesInfoProps {
    series: any;
    globalBest: { season: number; ep: any } | null;
    globalWorst: { season: number; ep: any } | null;
}

export default function SeriesInfo({ series, globalBest, globalWorst }: SeriesInfoProps) {
    return (
        <div className="glass p-6 md:p-8 rounded-2xl mb-12 flex flex-col md:flex-row gap-8 items-start animate-fade-in relative z-10 w-full max-w-6xl mx-auto">
            <img
                src={series.Poster}
                alt={series.Title}
                className="w-full md:w-64 rounded-lg shadow-2xl object-cover"
            />
            <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-4 mb-2">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {series.Title}
                    </h2>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium">
                        {series.Year}
                    </span>
                </div>

                <p className="text-gray-400 mb-6 max-w-2xl leading-relaxed">
                    {series.Plot}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-black/40 px-5 py-3 rounded-lg border border-white/5">
                        <span className="block text-xs text-gray-500 uppercase tracking-widest font-bold">IMDb Rating</span>
                        <span className="text-2xl font-bold text-yellow-500">
                            ★ {series.imdbRating} <span className="text-sm text-gray-400 font-normal">({series.imdbVotes})</span>
                        </span>
                    </div>

                    {globalBest && (
                        <div className="bg-green-900/20 px-5 py-3 rounded-lg border border-green-500/20">
                            <span className="block text-xs text-green-400 uppercase tracking-widest font-bold">Best Episode</span>
                            <div className="font-semibold text-green-200 truncate max-w-[200px]" title={globalBest.ep.Title}>
                                S{globalBest.season}E{globalBest.ep.Episode}: {globalBest.ep.Title}
                            </div>
                            <span className="text-xl font-bold text-green-400">{globalBest.ep.imdbRating}</span>
                        </div>
                    )}

                    {globalWorst && (
                        <div className="bg-red-900/20 px-5 py-3 rounded-lg border border-red-500/20">
                            <span className="block text-xs text-red-400 uppercase tracking-widest font-bold">Worst Episode</span>
                            <div className="font-semibold text-red-200 truncate max-w-[200px]" title={globalWorst.ep.Title}>
                                S{globalWorst.season}E{globalWorst.ep.Episode}: {globalWorst.ep.Title}
                            </div>
                            <span className="text-xl font-bold text-red-400">{globalWorst.ep.imdbRating}</span>
                        </div>
                    )}
                </div>

                <a
                    href={`https://www.imdb.com/title/${series.imdbID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors font-medium"
                >
                    View on IMDb →
                </a>
            </div>
        </div>
    );
}
