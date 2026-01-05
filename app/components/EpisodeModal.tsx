"use client";
import React from "react";
import { Episode } from "../types";
import { useTheme } from "../context/ThemeContext";

interface EpisodeModalProps {
    episode: Episode | null;
    onClose: () => void;
}

export default function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    if (!episode) return null;

    return (
        <div className="fixed inset-0 z-[200] overflow-y-auto w-full h-full">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                <div
                    className={`relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all w-full max-w-lg p-8 animate-fade-in
                        ${isRetro
                            ? 'bg-[#1a0505] border-4 border-[#c5a059] shadow-[0_0_50px_rgba(197,160,89,0.2)]'
                            : 'bg-zinc-900 border border-white/10'
                        }`}
                >
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20
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
                            {episode.Title}
                        </h2>

                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-lg font-bold text-xl
                                ${isRetro
                                    ? 'bg-[#8a0c0c] text-[#c5a059] border-2 border-[#c5a059]'
                                    : 'bg-white/10 text-white'
                                }`}>
                                S{episode.season} E{episode.Episode}
                            </div>
                            <div className={`text-4xl font-bold
                                ${isRetro ? 'text-[#c5a059] font-mono' : 'text-emerald-400'}`}>
                                {episode.imdbRating}
                                <span className="text-lg opacity-50 ml-1">/10</span>
                            </div>
                        </div>

                        <a
                            href={`https://www.imdb.com/title/${episode.imdbID}`}
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
        </div>
    );
}
