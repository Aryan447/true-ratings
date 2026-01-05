"use client";
import React from 'react';
import { CastMember } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CastRowProps {
    cast: CastMember[];
}

export default function CastRow({ cast }: CastRowProps) {
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    if (!cast || cast.length === 0) return null;

    return (
        <div className="w-full mb-8 animate-fade-in">
            <h3 className={`text-lg md:text-xl font-bold mb-4 uppercase tracking-widest
                ${isRetro ? 'text-[#c5a059] font-mono' : 'text-gray-300'}`}>
                {isRetro ? 'Dramatis Personae' : 'Top Cast'}
            </h3>

            <div className="overflow-x-auto pb-4 no-scrollbar flex gap-4 md:gap-6">
                {cast.map((member) => (
                    <a
                        key={member.id}
                        href={member.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 group w-24 md:w-32 text-center"
                    >
                        <div className={`relative mb-2 rounded-full overflow-hidden aspect-square border-2 transition-transform transform group-hover:scale-105
                            ${isRetro
                                ? 'border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.3)] sepia'
                                : 'border-white/10 group-hover:border-white/50'
                            }`}
                        >
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center 
                                    ${isRetro ? 'bg-[#1a0505] text-[#c5a059]' : 'bg-white/10 text-gray-400'}`}>
                                    ?
                                </div>
                            )}
                        </div>

                        <div className={`text-xs md:text-sm font-bold truncate
                            ${isRetro ? 'text-[#c5a059]' : 'text-white'}`}>
                            {member.name}
                        </div>
                        <div className={`text-[10px] md:text-xs truncate
                            ${isRetro ? 'text-[#8a0c0c] font-bold' : 'text-gray-400'}`}>
                            as {member.character}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
