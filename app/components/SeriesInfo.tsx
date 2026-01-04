"use client";
import React from "react";

interface SeriesInfoProps {
    series: any;
    globalBest: { season: number; ep: any } | null;
    globalWorst: { season: number; ep: any } | null;
}

export default function SeriesInfo({ series, globalBest, globalWorst }: SeriesInfoProps) {
    return (
        <div className="cinema-border p-8 mb-12 flex flex-col md:flex-row gap-8 items-start relative z-10 w-full max-w-6xl mx-auto bg-[#1a0505]">
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

                <p className="text-[#f0e6d2] mb-6 max-w-2xl leading-relaxed text-xl italic opacity-90">
                    "{series.Plot}"
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="bg-[#110202] px-6 py-4 border-2 border-[#c5a059] flex flex-col items-center">
                        <span className="block text-xs text-[#8a0c0c] uppercase tracking-widest font-bold mb-1">Critics Rating</span>
                        <span className="text-3xl font-bold text-[#c5a059]">
                            {series.imdbRating}
                        </span>
                        <span className="text-xs text-[#f0e6d2] opacity-50">/10</span>
                    </div>

                    {globalBest && (
                        <div className="bg-[#0f1a0f] px-6 py-4 border-2 border-[#1a4a1a] flex flex-col justify-center">
                            <span className="block text-xs text-[#2a8a2a] uppercase tracking-widest font-bold mb-1">Masterpiece</span>
                            <div className="font-bold text-[#c5e6c5] truncate max-w-[150px]" title={globalBest.ep.Title}>
                                "{globalBest.ep.Title}"
                            </div>
                            <span className="text-xl font-bold text-[#2a8a2a]">{globalBest.ep.imdbRating}</span>
                        </div>
                    )}
                </div>

                <a
                    href={`https://www.imdb.com/title/${series.imdbID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 border-2 border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-[#1a0505] transition-colors font-bold uppercase tracking-widest"
                >
                    View Program
                </a>
            </div>
        </div>
    );
}
