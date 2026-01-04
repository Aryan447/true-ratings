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
    return (
        <div className="w-full max-w-[90vw] mx-auto mb-16 animate-fade-in pl-4">
            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight drop-shadow-lg">{title}</h2>

            <div className="relative group">
                <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x px-2 pt-2">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 w-[180px] cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 snap-start z-10"
                            onClick={() => onSelect(item.title)}
                        >
                            <div className="relative aspect-[2/3] liquid-card overflow-hidden mb-4">
                                {item.poster ? (
                                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">No Poster</div>
                                )}
                                <div className="absolute top-2 right-2 px-3 py-1 text-xs font-bold rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white">
                                    {item.rating}
                                </div>
                            </div>
                            <h3 className="text-base font-semibold text-white/90 truncate pl-1">{item.title}</h3>
                            <p className="text-xs text-white/50 pl-1">{item.year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
