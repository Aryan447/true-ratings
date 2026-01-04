"use client";
import React from "react";

interface SeriesInfoProps {
    series: any;
    globalBest: { season: number; ep: any } | null;
    globalWorst: { season: number; ep: any } | null;
}

export default function SeriesInfo({ series, globalBest, globalWorst }: SeriesInfoProps) {
    return (
        <div className="relative w-full max-w-7xl mx-auto mb-20 animate-fade-in px-4">

            {/* Liquid Card Container */}
            <div className="liquid-card overflow-hidden relative p-8 md:p-16 flex flex-col md:flex-row gap-12 items-start z-10">

                {/* Clean Poster (Floating) */}
                <div className="w-full md:w-[320px] flex-shrink-0 relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-3xl transform group-hover:scale-105 transition-transform duration-700"></div>
                    <img
                        src={series.Poster}
                        alt={series.Title}
                        className="w-full rounded-2xl shadow-2xl relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2"
                    />
                </div>

                <div className="flex-1 pt-2 relative">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter text-white drop-shadow-md leading-none">
                        {series.Title}
                    </h1>
                    <div className="flex items-center gap-4 mb-8 text-lg text-blue-100/70 font-medium">
                        <span className="bg-white/10 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">{series.Year}</span>
                        <span>{series.totalSeasons} Seasons</span>
                        <span className="flex items-center gap-1">★ {series.imdbRating}</span>
                    </div>

                    <p className="text-2xl text-blue-50/80 leading-relaxed mb-12 max-w-2xl font-normal">
                        {series.Plot}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="liquid-card p-6 bg-white/5 hover:bg-white/10">
                            <div className="text-xs uppercase tracking-widest text-blue-200/50 font-bold mb-2">IMDb Rating</div>
                            <div className="text-5xl font-bold text-white tracking-tighter">
                                {series.imdbRating}
                            </div>
                        </div>

                        {globalBest && (
                            <div className="liquid-card p-6 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20">
                                <div className="text-xs uppercase tracking-widest text-emerald-300/70 font-bold mb-2">Peak</div>
                                <div className="text-3xl font-bold text-emerald-100 tracking-tight mb-1">
                                    {globalBest.ep.imdbRating}
                                </div>
                                <div className="text-sm text-emerald-200/60 truncate">S{globalBest.season}E{globalBest.ep.Episode}: {globalBest.ep.Title}</div>
                            </div>
                        )}

                        {globalWorst && (
                            <div className="liquid-card p-6 bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20">
                                <div className="text-xs uppercase tracking-widest text-rose-300/70 font-bold mb-2">Dip</div>
                                <div className="text-3xl font-bold text-rose-100 tracking-tight mb-1">
                                    {globalWorst.ep.imdbRating}
                                </div>
                                <div className="text-sm text-rose-200/60 truncate">S{globalWorst.season}E{globalWorst.ep.Episode}: {globalWorst.ep.Title}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
