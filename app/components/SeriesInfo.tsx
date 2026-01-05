
"use client";
import React from "react";
import CastRow from "./CastRow";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

import { SeriesData, Episode } from "../types";

interface SeriesInfoProps {
    series: SeriesData;
    globalBest: { season: number; ep: Episode } | null;
    globalWorst: { season: number; ep: Episode } | null;
}

export default function SeriesInfo({ series, globalBest, globalWorst }: SeriesInfoProps) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const isRetro = theme === 'retro';

    const totalEpisodes = React.useMemo(() => {
        return Object.values(series.seasons).reduce((acc, season) => acc + season.length, 0);
    }, [series.seasons]);

    const bingeTime = React.useMemo(() => {
        const totalMinutes = totalEpisodes * (series.averageRuntime || 30);
        const days = Math.floor(totalMinutes / (24 * 60));
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
        return `${days > 0 ? `${days}d ` : ''}${hours} h`;
    }, [totalEpisodes, series.averageRuntime]);

    if (isRetro) {
        return (
            <div className="cinema-border p-4 md:p-8 mb-12 flex flex-col md:flex-row gap-8 items-start relative z-10 w-full max-w-6xl mx-auto bg-[#1a0505]">
                <div className="relative p-2 bg-black shadow-2xl">
                    <img
                        src={series.Poster}
                        alt={series.Title}
                        className="w-full md:w-64 border-4 border-white grayscale hover:grayscale-0 transition-all duration-700"
                    />
                </div>

                <div className="flex-1 font-serif">
                    <div className="flex flex-wrap items-baseline gap-4 mb-4 border-b-2 border-double border-[#c5a059] pb-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#c5a059] uppercase tracking-widest text-shadow-retro">
                            {series.Title}
                        </h2>
                        <span className="bg-[#8a0c0c] text-[#c5a059] px-3 py-1 font-bold text-lg border border-[#c5a059]">
                            {series.Year}
                        </span>
                    </div>

                    <div className="flex gap-4 mb-4 text-[#c5a059] text-sm font-bold uppercase tracking-widest">
                        <span className={series.status === 'Ended' ? 'text-red-500' : 'text-green-500'}>
                            {series.status}
                        </span>
                        <span>•</span>
                        <span>{bingeTime} Binge</span>
                        <span>•</span>
                        <span>{series.genres?.join(", ")}</span>
                    </div>

                    <p className="text-[#f0e6d2] mb-6 max-w-2xl leading-relaxed text-xl italic opacity-90">
                        &quot;{series.Plot}&quot;
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="bg-[#110202] px-6 py-4 border-2 border-[#c5a059] flex flex-col items-center">
                            <span className="block text-xs text-[#8a0c0c] uppercase tracking-widest font-bold mb-1">{t.criticsRating}</span>
                            <span className="text-3xl font-bold text-[#c5a059]">
                                {series.imdbRating}
                            </span>
                            <span className="text-xs text-[#f0e6d2] opacity-50">/10</span>
                        </div>

                        {globalBest && (
                            <div className="bg-[#0f1a0f] px-6 py-4 border-2 border-[#1a4a1a] flex flex-col justify-center">
                                <span className="block text-xs text-[#2a8a2a] uppercase tracking-widest font-bold mb-1">{t.masterpiece}</span>
                                <div className="font-bold text-[#c5e6c5] truncate max-w-[150px]" title={globalBest.ep.Title}>
                                    &quot;{globalBest.ep.Title}&quot;
                                </div>
                                <span className="text-xl font-bold text-[#2a8a2a]">{globalBest.ep.imdbRating}</span>
                            </div>
                        )}
                    </div>
                    {/* ... (rest of retro layout) ... */}
                    <div className="mt-8">
                        <CastRow cast={series.cast} />
                    </div>

                    <a
                        href={`https://www.imdb.com/title/${series.imdbID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2 border-2 border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-[#1a0505] transition-colors font-bold uppercase tracking-widest"
                    >
                        {t.viewProgram}
                    </a>
                </div>
            </div>
        );
    }

    // Modern Layout
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

            <div className="relative z-10 p-4 md:p-12 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                {/* Poster with Reflection */}
                <div className="w-full md:w-[300px] flex-shrink-0 relative group perspective-1000">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 transform group-hover:rotate-y-12">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={series.Poster}
                            alt={series.Title}
                            className={`w-full rounded-xl shadow-2xl border
                                ${isRetro ? 'border-red-500 sepia contrast-125' : 'border-white/10'}`}
                        />
                    </div>
                </div>

                <div className="flex-1 pt-2 w-full">
                    <div className="flex flex-col md:block">
                        <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight
                            ${isRetro ? 'text-yellow-500 font-mono tracking-widest uppercase text-shadow-retro' : 'text-white'}`}>
                            {series.Title}
                        </h1>
                        <div className={`flex flex-wrap items-center gap-2 md:gap-4 mb-8 text-sm md:text-lg 
                            ${isRetro ? 'text-red-500 font-mono tracking-widest' : 'text-gray-400 font-light'}`}>
                            <span className={`${isRetro ? 'border border-red-500 text-red-500 bg-transparent' : 'bg-white/10 text-white'} px-3 py-1 rounded-md text-xs md:text-sm font-medium`}>
                                {series.Year}
                            </span>
                            <span>{series.totalSeasons} {t.seasonsLabel}</span>
                            <span>{series.imdbVotes} {t.votes}</span>
                        </div>

                        {/* Stats Bar */}
                        <div className={`flex flex-wrap gap-4 mb-6 text-sm font-medium 
                             ${isRetro ? 'text-yellow-600 font-mono' : 'text-gray-300'}`}>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold 
                                    ${series.status === 'Ended' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                    {series.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="opacity-50">Binge:</span>
                                <span>{bingeTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="opacity-50">Genres:</span>
                                <span>{series.genres?.join(", ")}</span>
                            </div>
                        </div>
                    </div>

                    <p className={`text-base md:text-xl leading-relaxed mb-10 max-w-3xl 
                        ${isRetro ? 'text-yellow-100/80 font-mono tracking-wide' : 'text-gray-300 font-light'}`}>
                        {series.Plot}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className={`p-4 md:p-6 rounded-xl border backdrop-blur-sm 
                            ${isRetro ? 'bg-red-900/20 border-red-500' : 'bg-black/40 border-white/5'}`}>
                            <div className={`text-sm uppercase tracking-wider font-semibold mb-1 
                                ${isRetro ? 'text-red-400 font-mono' : 'text-gray-500'}`}>{t.imdbRating}</div>
                            <div className={`text-3xl md:text-4xl font-bold 
                                ${isRetro ? 'text-yellow-500 font-mono' : 'text-white'}`}>
                                {series.imdbRating}<span className="text-lg text-gray-500 font-normal">/10</span>
                            </div>
                        </div>

                        {globalBest && (
                            <div className={`p-4 md:p-6 rounded-xl border backdrop-blur-sm 
                                ${isRetro ? 'bg-yellow-900/20 border-yellow-500' : 'bg-emerald-900/10 border-emerald-500/10'}`}>
                                <div className={`text-sm uppercase tracking-wider font-semibold mb-1 
                                    ${isRetro ? 'text-yellow-500 font-mono' : 'text-emerald-500'}`}>{t.highestRated}</div>
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
                            <div className={`p-4 md:p-6 rounded-xl border backdrop-blur-sm 
                                ${isRetro ? 'bg-red-950/40 border-red-800' : 'bg-rose-900/10 border-rose-500/10'}`}>
                                <div className={`text-sm uppercase tracking-wider font-semibold mb-1 
                                    ${isRetro ? 'text-red-500 font-mono' : 'text-rose-500'}`}>{t.lowestRated}</div>
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

                    <div className="mt-8 flex flex-wrap gap-4">
                        <a
                            href={`https://www.imdb.com/title/${series.imdbID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2
                                ${isRetro ? 'bg-red-600 text-yellow-300 hover:bg-red-700 border-2 border-yellow-500 uppercase tracking-widest' : 'bg-[#F5C518] text-black hover:bg-[#E2B616]'}`}
                        >
                            {isRetro ? t.checkArchives : t.viewOnImdb}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                        </a>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert(t.linkCopied);
                            }}
                            className={`px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2
                                ${isRetro
                                    ? 'bg-transparent text-[#c5a059] border-2 border-[#c5a059] hover:bg-[#c5a059] hover:text-[#1a0505] uppercase tracking-widest'
                                    : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            Share
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4">
                        {series.officialSite && (
                            <a
                                href={series.officialSite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2
                                    ${isRetro ? 'text-green-500 border border-green-500 hover:bg-green-900/20' : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'}`}
                            >
                                🌐 Official Website
                            </a>
                        )}
                        {series.network && (
                            <a
                                href={series.officialSite || `https://www.google.com/search?q=watch ${series.Title} on ${series.network}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2
                                    ${isRetro ? 'text-purple-400 border border-purple-500 hover:bg-purple-900/20' : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'}`}
                            >
                                📺 Watch on {series.network}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
