"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import InstallPrompt from "./InstallPrompt";

import { Episode } from "../types";

interface HeaderControlsProps {
    seasons?: { [key: number]: Episode[] };
    onScrollToSeason?: (season: number) => void;
    onRandomEpisode?: () => void;
    showBack?: boolean;
    onBack?: () => void;
}

export default function HeaderControls({ seasons, onScrollToSeason, onRandomEpisode, showBack, onBack }: HeaderControlsProps) {
    const { language, toggleLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const isRetro = theme === "retro";
    const [showSeasonMenu, setShowSeasonMenu] = React.useState(false);

    return (
        <div className="fixed top-2 right-2 md:top-4 md:right-4 z-[100] flex items-center gap-2 md:gap-4 p-1 rounded-full bg-black/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none transition-all">
            {/* Back Button */}
            {showBack && onBack && (
                <button
                    onClick={onBack}
                    className={`p-2 rounded-full transition-all backdrop-blur-md border flex items-center justify-center mr-2
                        ${isRetro
                            ? "bg-black text-red-500 border-red-500 hover:bg-red-900"
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        }`}
                    title="Back to Home"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            )}
            {/* Random Episode Button */}
            {onRandomEpisode && (
                <button
                    onClick={onRandomEpisode}
                    className={`p-2 rounded-full transition-all backdrop-blur-md border flex items-center justify-center
                        ${isRetro
                            ? "bg-black text-yellow-500 border-yellow-500 hover:bg-yellow-900"
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        }`}
                    title="Random Episode"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            )}

            {/* Season Switcher Dropdown */}
            {seasons && Object.keys(seasons).length > 0 && onScrollToSeason && (
                <div className="relative">
                    <button
                        onClick={() => setShowSeasonMenu(!showSeasonMenu)}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-md border flex items-center gap-2
                            ${isRetro
                                ? "bg-black text-yellow-500 border-yellow-500 hover:bg-yellow-900"
                                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                            }`}
                    >
                        <span>Seasons</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showSeasonMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showSeasonMenu && (
                        <div className={`absolute top-full right-0 mt-2 w-32 rounded-xl overflow-hidden shadow-2xl z-[110] max-h-60 overflow-y-auto
                            ${isRetro ? 'bg-black border border-yellow-500' : 'bg-neutral-900 border border-white/20'}`}>
                            {Object.keys(seasons).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => {
                                        onScrollToSeason(Number(s));
                                        setShowSeasonMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors
                                        ${isRetro
                                            ? 'text-yellow-500 hover:bg-yellow-900/30'
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    Season {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Install App Prompt */}
            <InstallPrompt />

            {/* Language Toggle */}
            <button
                onClick={toggleLanguage}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all backdrop-blur-md border 
        ${isRetro
                        ? "bg-black text-yellow-500 border-yellow-500 hover:bg-yellow-900"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
            >
                {language === "en" ? "हिंदी" : "English"}
            </button>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-[10px] md:text-xs uppercase transition-all backdrop-blur-md border 
        ${isRetro
                        ? "bg-yellow-500 text-black border-red-500 hover:scale-105"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
            >
                {isRetro ? t.switchToModern : t.switchToRetro}
            </button>
        </div>
    );
}
