"use client";
import React from 'react';
import { Episode } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TopEpisodesProps {
    seasons: { [key: number]: Episode[] };
    onSelectEpisode?: (episode: Episode) => void;
}

export default function TopEpisodes({ seasons, onSelectEpisode }: TopEpisodesProps) {
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    const topEpisodes = React.useMemo(() => {
        const all = Object.entries(seasons).flatMap(([s, eps]) =>
            eps.map(e => ({ ...e, season: Number(s) }))
        );
        // Sort best to worst
        return all.sort((a, b) => {
            const ra = parseFloat(a.imdbRating) || 0;
            const rb = parseFloat(b.imdbRating) || 0;
            return rb - ra;
        }).slice(0, 3);
    }, [seasons]);

    if (topEpisodes.length === 0) return null;

    const medals = ['🥇', '🥈', '🥉'];
    const medalColors = [
        'from-yellow-400/20 to-yellow-600/20 border-yellow-500/50',
        'from-gray-300/20 to-gray-500/20 border-gray-400/50',
        'from-orange-400/20 to-orange-700/20 border-orange-500/50'
    ];

    return (
        <div className="w-full max-w-7xl mx-auto mb-16 px-4 animate-fade-in delay-100">
            <h3 className={`text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 
                ${isRetro ? 'text-yellow-500 font-mono uppercase tracking-widest' : 'text-white'}`}>
                <span className="text-2xl">🏆</span> Hall of Fame
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topEpisodes.map((ep, i) => (
                    <div
                        key={`${ep.season}-${ep.Episode}`}
                        onClick={() => onSelectEpisode?.(ep)}
                        className={`relative p-6 rounded-xl border backdrop-blur-md cursor-pointer group transition-all duration-300 hover:-translate-y-1
                            ${isRetro
                                ? `bg-black border ${i === 0 ? 'border-yellow-500' : 'border-red-900'} hover:bg-zinc-900`
                                : `bg-gradient-to-br ${medalColors[i]} hover:bg-white/10`
                            }
                        `}
                    >
                        <div className="absolute top-4 right-4 text-3xl filter drop-shadow-lg">{medals[i]}</div>

                        <div className={`text-sm font-bold mb-2 uppercase tracking-wider opacity-75
                            ${isRetro ? 'text-red-500' : 'text-gray-300'}`}>
                            S{ep.season} • E{ep.Episode}
                        </div>

                        <h4 className={`text-lg font-bold mb-3 line-clamp-2 leading-tight
                             ${isRetro ? 'text-[#c5a059] font-serif' : 'text-white'}`}>
                            {ep.Title}
                        </h4>

                        <div className={`text-4xl font-black tabular-nums tracking-tighter
                            ${isRetro ? 'text-white text-shadow-retro' : 'text-white'}`}>
                            {ep.imdbRating}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
