"use client";
import React from "react";
import { SearchResult } from "../types";
import { useTheme } from "../context/ThemeContext";

interface WatchlistRowProps {
    items: SearchResult[];
    onSelect: (title: string) => void;
    onRemove: (id: number) => void;
}

export default function WatchlistRow({ items, onSelect, onRemove }: WatchlistRowProps) {
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    if (items.length === 0) return null;

    return (
        <div className="w-full max-w-6xl mb-12 animate-fade-in relative z-10 px-4">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3
                ${isRetro ? 'text-red-500 font-mono tracking-widest uppercase' : 'text-white tracking-tight'}`}>
                {isRetro && <span className="animate-pulse">♥</span>}
                Your Watchlist
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="relative group flex-shrink-0 w-32 md:w-40 snap-start"
                    >
                        {/* Remove Button - Top Right */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(item.id);
                            }}
                            className="absolute -top-2 -right-2 z-20 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                            title="Remove from Watchlist"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <div
                            className={`relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2
                                ${isRetro
                                    ? 'border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                                    : 'shadow-lg hover:shadow-2xl'}`}
                            onClick={() => onSelect(item.title)}
                        >
                            <img
                                src={item.poster}
                                alt={item.title}
                                className={`w-full h-full object-cover transition-all duration-500
                                    ${isRetro ? 'sepia contrast-125' : ''}`}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <h3 className={`text-sm font-bold leading-tight
                                    ${isRetro ? 'text-yellow-400 font-mono' : 'text-white'}`}>
                                    {item.title}
                                </h3>
                                <div className="text-xs text-white/70 mt-1">{item.rating} ★</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
