"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import InstallPrompt from "./InstallPrompt";

export default function HeaderControls() {
    const { language, toggleLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const isRetro = theme === "retro";

    return (
        <div className="fixed top-2 right-2 md:top-4 md:right-4 z-[100] flex items-center gap-2 md:gap-4 p-1 rounded-full bg-black/20 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none transition-all">
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
