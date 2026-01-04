"use client";
import React from "react";

interface SeriesInfoProps {
    series: any;
    globalBest: { season: number; ep: any } | null;
    globalWorst: { season: number; ep: any } | null;
}

import { useTheme } from "../context/ThemeContext";

export default function SeriesInfo({ series, globalBest, globalWorst }: SeriesInfoProps) {
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    return (
        <div className={`relative w-full max-w-6xl mx-auto mb-16 rounded-3xl overflow-hidden animate-fade-in 
            ${isRetro ? 'border-4 border-yellow-500 bg-black shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'glass'}`}>

            {/* Ambient Backdrop - Modern Only */}
            {!isRetro && (
                <div
                    className="absolute inset-0 opacity-20 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${series.Poster})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(60px) saturate(200%)'
                    }}
                />
            )}

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-[300px] flex-shrink-0">
                    <img
                        src={series.Poster}
                        alt={series.Title}
                        className={`w-full rounded-xl shadow-2xl border 
                            ${isRetro ? 'border-red-500 sepia contrast-125' : 'border-white/10'}`}
                    />
                </div>

                <div className="flex-1 pt-2">
                    <h1 className={`text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-tight 
                        ${isRetro ? 'text-yellow-500 font-mono tracking-widest uppercase text-shadow-retro' : 'text-white'}`}>
                        {series.Title}
                    </h1>
                    <div className={`flex items-center gap-4 mb-8 text-lg 
                        ${isRetro ? 'text-red-500 font-mono tracking-widest' : 'text-gray-400 font-light'}`}>
                        <span className={`${isRetro ? 'border border-red-500 text-red-500 bg-transparent' : 'bg-white/10 text-white'} px-3 py-1 rounded-md text-sm font-medium`}>
                            {series.Year}
                        </span>
                        <span>{series.totalSeasons} Seasons</span>
                        <span>{series.imdbVotes} Votes</span>
                    </div>

                    <p className={`text-xl leading-relaxed mb-10 max-w-3xl 
                        ${isRetro ? 'text-yellow-100/80 font-mono tracking-wide' : 'text-gray-300 font-light'}`}>
                        {series.Plot}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-6 rounded-xl border backdrop-blur-sm 
                            ${isRetro ? 'bg-red-900/20 border-red-500' : 'bg-black/40 border-white/5'}`}>
                            <div className={`text-sm uppercase tracking-wider font-semibold mb-1 
                                ${isRetro ? 'text-red-400 font-mono' : 'text-gray-500'}`}>IMDb Rating</div>
                            <div className={`text-4xl font-bold 
                                ${isRetro ? 'text-yellow-500 font-mono' : 'text-white'}`}>
                                {series.imdbRating}<span className="text-lg text-gray-500 font-normal">/10</span>
                            </div>
                        </div>

                        {globalBest && (
                            <div className={`p-6 rounded-xl border backdrop-blur-sm 
                                ${isRetro ? 'bg-yellow-900/20 border-yellow-500' : 'bg-emerald-900/10 border-emerald-500/10'}`}>
                                <div className={`text-sm uppercase tracking-wider font-semibold mb-1 
                                    ${isRetro ? 'text-yellow-500 font-mono' : 'text-emerald-500'}`}>Highest Rated</div>
                                <div className={`font-medium truncate mb-1 
                                    ${isRetro ? 'text-red-300 font-mono' : 'text-emerald-200'}`}>
                                    S{globalBest.season}E{globalBest.ep.Episode}: {globalBest.ep.Title}
                                </div>
                                <div className={`text-3xl font-bold 
                                    ${isRetro ? 'text-yellow-400 font-mono' : 'text-emerald-400'}`}>
                                    {globalBest.ep.imdbRating}
                                </div>
                            </div>
                        )}

                        {globalWorst && (
                            <div className={`p-6 rounded-xl border backdrop-blur-sm 
                                ${isRetro ? 'bg-red-950/40 border-red-800' : 'bg-rose-900/10 border-rose-500/10'}`}>
                                <div className={`text-sm uppercase tracking-wider font-semibold mb-1 
                                    ${isRetro ? 'text-red-500 font-mono' : 'text-rose-500'}`}>Lowest Rated</div>
                                <div className={`font-medium truncate mb-1 
                                    ${isRetro ? 'text-red-900 font-mono' : 'text-rose-200'}`}>
                                    S{globalWorst.season}E{globalWorst.ep.Episode}: {globalWorst.ep.Title}
                                </div>
                                <div className={`text-3xl font-bold 
                                    ${isRetro ? 'text-red-600 font-mono' : 'text-rose-400'}`}>
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
                            className={`px-6 py-3 rounded-lg font-bold transition-colors 
                                ${isRetro ? 'bg-red-600 text-yellow-300 hover:bg-red-700 border-2 border-yellow-500 uppercase tracking-widest' : 'bg-[#F5C518] text-black hover:bg-[#E2B616]'}`}
                        >
                            {isRetro ? "CHECK ARCHIVES" : "View on IMDb"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
