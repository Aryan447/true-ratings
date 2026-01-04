"use client";
import React from "react";

interface TrendingItem {
    id: number;
    title: string;
    poster: string;
    rating: string | number;
    year: string;
}

interface TrendingRowProps {
    title: string;
    items: TrendingItem[];
    onSelect: (query: string) => void;
}

import { useTheme } from "../context/ThemeContext";

export default function TrendingRow({ title, items, onSelect }: TrendingRowProps) {
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    return (
        <div className="w-full max-w-7xl mx-auto px-6 mb-12 animate-fade-in">
            <h2 className={`text-2xl font-bold mb-4 pl-1 border-l-4 
        ${isRetro ? 'text-yellow-500 border-red-500 font-mono tracking-widest' : 'text-white border-yellow-500'}`}>
                {isRetro ? title.toUpperCase() : title}
            </h2>

            <div className="relative group">
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 w-[160px] cursor-pointer transition-transform duration-300 hover:scale-105 snap-start"
                            onClick={() => onSelect(item.title)}
                        >
                            <div className={`relative aspect-[2/3] overflow-hidden mb-2 
                ${isRetro ? 'border-2 border-yellow-500 shadow-[4px_4px_0px_#ef4444]' : 'rounded-xl glass border-0'}`}>
                                {item.poster ? (
                                    <img src={item.poster} alt={item.title} className={`w-full h-full object-cover ${isRetro ? 'sepia-[.4] contrast-125' : ''}`} />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs text-center p-2">
                                        No Poster
                                    </div>
                                )}
                                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold 
                    ${isRetro ? 'bg-red-600 text-yellow-300 border border-yellow-300' : 'bg-black/80 backdrop-blur-md rounded text-yellow-500'}`}>
                                    {item.rating}
                                </div>
                            </div>
                            <h3 className={`text-sm font-medium truncate ${isRetro ? 'text-yellow-500 font-mono' : 'text-white'}`}>{item.title}</h3>
                            <p className="text-xs text-gray-500">{item.year}</p>
                        </div>
                    ))}
                </div>

                {/* Fade edges for scroll indication */}
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
