"use client";
import React, { useRef } from "react";

import { Episode } from "../types";

interface EpisodeGridProps {
    seasons: { [key: number]: Episode[] };
    globalBest: { season: number; ep: Episode } | null;
    globalWorst: { season: number; ep: Episode } | null;
}

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const getColor = (r: number, isRetro: boolean) => {
    if (isRetro) {
        // Red scale for retro
        if (r >= 8.5) return "bg-red-600 border-2 border-yellow-400"; // Hit
        if (r >= 7.0) return "bg-red-800 border border-red-900";     // Mid
        return "bg-black border border-red-900 text-red-700";        // Flop
    }
    if (r >= 9.0) return "bg-emerald-500";
    if (r >= 8.5) return "bg-emerald-600";
    if (r >= 8.0) return "bg-emerald-700";
    if (r >= 7.5) return "bg-yellow-600";
    if (r >= 7.0) return "bg-orange-600";
    if (r >= 6.0) return "bg-orange-700";
    return "bg-rose-700";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function EpisodeGrid({ seasons, globalBest, globalWorst }: EpisodeGridProps) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const isRetro = theme === 'retro';
    const seasonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [sortBy, setSortBy] = React.useState<'default' | 'best' | 'worst'>('default');
    const [selectedEpisode, setSelectedEpisode] = React.useState<Episode | null>(null);

    const getSeasonAvg = (episodes: Episode[]) => {
        const ratings = episodes.map(e => parseFloat(e.imdbRating)).filter(r => !isNaN(r));
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";
    };

    const scrollToSeason = (season: string) => {
        const element = seasonRefs.current[season];
        if (element) {
            const yOffset = -100; // Offset for sticky header
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Flatten and sort if not default
    const sortedEpisodes = React.useMemo(() => {
        if (sortBy === 'default') return null;

        // Ensure season is attached to episode object
        const all = Object.entries(seasons).flatMap(([s, eps]) =>
            eps.map(e => ({ ...e, season: Number(s) }))
        );

        return all.sort((a, b) => {
            const ra = parseFloat(a.imdbRating) || 0;
            const rb = parseFloat(b.imdbRating) || 0;
            return sortBy === 'best' ? rb - ra : ra - rb;
        });
    }, [sortBy, seasons]);

    const renderCard = (ep: Episode, i: number, explicitSeason?: number | string) => {
        const rating = parseFloat(ep.imdbRating);
        const isBest = globalBest?.ep.imdbID === ep.imdbID;
        const invalid = isNaN(rating);
        const seasonNum = ep.season || explicitSeason;

        if (isRetro) {
            return (
                <div
                    key={i}
                    onClick={() => setSelectedEpisode({ ...ep, season: Number(seasonNum) })}
                    className="flex-shrink-0 w-32 bg-[#e6dcc3] text-black p-2 rounded-sm shadow-md relative group cursor-pointer hover:sepia transition-all"
                >
                    <div className="border border-black h-full p-2 flex flex-col justify-between text-center relative">
                        <span className="font-bold text-xs uppercase tracking-tighter mb-1 line-clamp-1">{ep.Title}</span>
                        <div className="my-2 text-2xl font-bold font-mono">{invalid ? "-" : rating.toFixed(1)}</div>
                        <span className="text-[10px] font-bold border-t border-black pt-1">S{seasonNum} E{ep.Episode}</span>
                    </div>
                </div>
            );
        }

        return (
            <div key={i} className="relative group cursor-pointer" onClick={() => setSelectedEpisode({ ...ep, season: Number(seasonNum) })}>
                <div
                    className={`
                        aspect-[3/4] rounded-md flex flex-col items-center justify-end pb-2 text-center
                        transition-all duration-300 ease-out group-hover:scale-110 group-hover:z-10
                        ${invalid ? "bg-gray-800/50" : getColor(rating, isRetro)}
                        opacity-90 group-hover:opacity-100 shadow-md group-hover:shadow-xl
                        ${isBest ? "ring-1 ring-white" : ""}
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-md"></div>
                    <div className="relative z-10 w-full px-0.5">
                        <div className={`text-[10px] mb-0.5 font-medium text-white/70`}>S{seasonNum} E{ep.Episode}</div>
                        <div className={`text-xl font-bold tracking-tight text-white`}>
                            {invalid ? "-" : rating.toFixed(1)}
                        </div>
                    </div>
                </div>

                {/* Tooltip */}
                <div className={`hidden md:block absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-lg shadow-xl z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0 text-left bg-black/90 backdrop-blur-xl border border-white/10`}>
                    <div className={`font-bold text-xs mb-1 line-clamp-2 text-white`}>{ep.Title}</div>
                    <div className={`flex justify-between items-center text-[10px] text-gray-400`}>
                        <span>S{seasonNum} E{ep.Episode}</span>
                        <span className={!invalid ? 'text-white font-bold' : ""}>{rating} ★</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto relative">
            {/* Sort Controls */}
            <div className="flex justify-center mb-8 gap-4">
                {(['default', 'best', 'worst'] as const).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setSortBy(mode)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                            ${sortBy === mode
                                ? (isRetro ? 'bg-yellow-500 text-black border-2 border-red-500' : 'bg-white text-black')
                                : (isRetro ? 'bg-black text-yellow-500 border border-yellow-500 opacity-50' : 'bg-white/10 text-gray-400 hover:bg-white/20')}
                        `}
                    >
                        {mode === 'default' ? t.season : (mode === 'best' ? 'Top Rated' : 'Lowest Rated')}
                    </button>
                ))}
            </div>

            {/* Season Navigation Bar (Only in Default Mode & Modern) */}
            {sortBy === 'default' && !isRetro && (
                <div className="sticky top-16 md:top-0 z-40 bg-black/80 backdrop-blur-md py-4 mb-8 border-b border-white/10 overflow-x-auto no-scrollbar transition-all duration-300">
                    <div className="flex gap-2 px-4 whitespace-nowrap">
                        {Object.keys(seasons).map((season) => (
                            <button
                                key={season}
                                onClick={() => scrollToSeason(season)}
                                className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white"
                            >
                                {t.season} {season}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="space-y-12">
                {sortBy !== 'default' && sortedEpisodes ? (
                    // Flat Sorted List
                    <div className={`animate-fade-in ${isRetro ? 'flex flex-wrap gap-4 justify-center' : 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3'}`}>
                        {sortedEpisodes.map((ep, i) => renderCard(ep, i))}
                    </div>
                ) : (
                    // Default Season View
                    Object.entries(seasons).map(([season, episodes]) => {
                        const avg = getSeasonAvg(episodes);
                        return (
                            <div
                                key={season}
                                className="animate-fade-in scroll-mt-24"
                                ref={(el) => { seasonRefs.current[season] = el; }}
                            >
                                {isRetro ? (
                                    <div className="relative">
                                        <h3 className="text-3xl font-bold text-[#c5a059] mb-4 pl-4 border-l-4 border-[#8a0c0c] font-mono tracking-widest uppercase">
                                            {t.act} {season} <span className="text-sm font-normal text-[#f0e6d2] italic ml-4">({t.avg}: {avg})</span>
                                        </h3>
                                        <div className="bg-black py-4 px-2 overflow-x-auto flex gap-4 border-t-8 border-b-8 border-dashed border-[#333] relative">
                                            {episodes.map((ep, i) => renderCard(ep, i, season))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`flex items-baseline gap-4 mb-6 pb-4 border-b border-white/5`}>
                                            <h3 className={`text-3xl font-bold tracking-tight text-white`}>
                                                {t.season} {season}
                                            </h3>
                                            <span className={`text-xl font-light text-gray-500`}>{t.avg} {avg}</span>
                                        </div>

                                        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                                            {episodes.map((ep, i) => renderCard(ep, i, season))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Episode Modal */}
            {selectedEpisode && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedEpisode(null)}
                    />
                    <div
                        className={`relative z-10 w-full max-w-lg p-8 rounded-2xl shadow-2xl transform transition-all animate-fade-in
                            ${isRetro
                                ? 'bg-[#1a0505] border-4 border-[#c5a059] shadow-[0_0_50px_rgba(197,160,89,0.2)]'
                                : 'bg-zinc-900 border border-white/10'
                            }`}
                    >
                        <button
                            onClick={() => setSelectedEpisode(null)}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors
                                ${isRetro
                                    ? 'text-[#c5a059] hover:bg-[#c5a059] hover:text-black border border-[#c5a059]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="space-y-6">
                            <div className={`text-sm font-bold uppercase tracking-widest
                                ${isRetro ? 'text-[#8a0c0c]' : 'text-emerald-500'}`}>
                                {isRetro ? 'Classified Record' : 'Episode Details'}
                            </div>

                            <h2 className={`text-3xl font-bold leading-tight
                                ${isRetro ? 'text-[#c5a059] font-mono uppercase text-shadow-retro' : 'text-white'}`}>
                                {selectedEpisode.Title}
                            </h2>

                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-2 rounded-lg font-bold text-xl
                                    ${isRetro
                                        ? 'bg-[#8a0c0c] text-[#c5a059] border-2 border-[#c5a059]'
                                        : 'bg-white/10 text-white'
                                    }`}>
                                    S{selectedEpisode.season} E{selectedEpisode.Episode}
                                </div>
                                <div className={`text-4xl font-bold
                                    ${isRetro ? 'text-[#c5a059] font-mono' : 'text-emerald-400'}`}>
                                    {selectedEpisode.imdbRating}
                                    <span className="text-lg opacity-50 ml-1">/10</span>
                                </div>
                            </div>

                            <a
                                href={`https://www.imdb.com/title/${selectedEpisode.imdbID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full py-4 text-center font-bold uppercase tracking-widest transition-all
                                    ${isRetro
                                        ? 'bg-transparent text-[#c5a059] border-2 border-[#c5a059] hover:bg-[#c5a059] hover:text-black'
                                        : 'bg-[#F5C518] text-black hover:bg-[#E2B616] rounded-lg'
                                    }`}
                            >
                                {isRetro ? 'Access IMDB Archives' : 'View on IMDb'}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

