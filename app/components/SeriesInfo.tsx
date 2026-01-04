"use client";
import React from "react";

interface SeriesInfoProps {
    series: any;
    globalBest: { season: number; ep: any } | null;
    globalWorst: { season: number; ep: any } | null;
}

export default function SeriesInfo({ series, globalBest, globalWorst }: SeriesInfoProps) {
    // Use poster as backdrop if no specific backdrop is available (we only scraped Poster)
    // We can blur it heavily for the background

    return (
        <div className="relative w-full max-w-6xl mx-auto mb-16 rounded-3xl overflow-hidden glass animate-fade-in">
            {/* Ambient Backdrop */}
            <div
                className="absolute inset-0 opacity-20 z-0 pointer-events-none"
                style={{
                    backgroundImage: `url(${series.Poster})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(60px) saturate(200%)'
                }}
            />

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-[300px] flex-shrink-0">
                    <img
                        src={series.Poster}
                        alt={series.Title}
                        className="w-full rounded-xl shadow-2xl border border-white/10"
                    />
                </div>

                <div className="flex-1 pt-2">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
                        {series.Title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400 mb-8 font-light text-lg">
                        <span className="bg-white/10 text-white px-3 py-1 rounded-md text-sm font-medium">{series.Year}</span>
                        <span>{series.totalSeasons} Seasons</span>
                        <span>{series.imdbVotes} Votes</span>
                    </div>

                    <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl font-light">
                        {series.Plot}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm">
                            <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">IMDb Rating</div>
                            <div className="text-4xl font-bold text-white">
                                {series.imdbRating}<span className="text-lg text-gray-500 font-normal">/10</span>
                            </div>
                        </div>

                        {globalBest && (
                            <div className="p-6 rounded-xl bg-emerald-900/10 border border-emerald-500/10 backdrop-blur-sm">
                                <div className="text-sm text-emerald-500 uppercase tracking-wider font-semibold mb-1">Highest Rated</div>
                                <div className="font-medium text-emerald-200 truncate mb-1">
                                    S{globalBest.season}E{globalBest.ep.Episode}: {globalBest.ep.Title}
                                </div>
                                <div className="text-3xl font-bold text-emerald-400">
                                    {globalBest.ep.imdbRating}
                                </div>
                            </div>
                        )}

                        {globalWorst && (
                            <div className="p-6 rounded-xl bg-rose-900/10 border border-rose-500/10 backdrop-blur-sm">
                                <div className="text-sm text-rose-500 uppercase tracking-wider font-semibold mb-1">Lowest Rated</div>
                                <div className="font-medium text-rose-200 truncate mb-1">
                                    S{globalWorst.season}E{globalWorst.ep.Episode}: {globalWorst.ep.Title}
                                </div>
                                <div className="text-3xl font-bold text-rose-400">
                                    {globalWorst.ep.imdbRating}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <a
                            href={`https://www.imdb.com/title/${series.imdbID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-lg bg-[#F5C518] text-black font-bold hover:bg-[#E2B616] transition-colors"
                        >
                            View on IMDb
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
