"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface Translations {
    season: string;
    episode: string;
    avg: string;
    trendingWorld: string;
    trendingIndia: string;
    loading: string;
    dataProvidedBy: string;
    searchPlaceholder: string;
    act: string;
    scene: string;
    best: string;
    worst: string;
    seriesNotFound: string;
    errorFetching: string;
    criticsRating: string;
    masterpiece: string;
    viewProgram: string;
    seasonsLabel: string;
    votes: string;
    imdbRating: string;
    viewOnImdb: string;
    checkArchives: string;
    highestRated: string;
    lowestRated: string;
}

const translations: Record<Language, Translations> = {
    en: {
        season: "Season",
        episode: "Episode",
        avg: "Avg",
        trendingWorld: "Trending Worldwide",
        trendingIndia: "Trending in India",
        loading: "Loading...",
        dataProvidedBy: "Data provided by TVMaze & IMDb",
        searchPlaceholder: "Search for a TV Series...",
        act: "Act",
        scene: "SCENE",
        best: "Best",
        worst: "Worst",
        seriesNotFound: "Series not found!",
        errorFetching: "Error fetching data",
        criticsRating: "Critics Rating",
        masterpiece: "Masterpiece",
        viewProgram: "View Program",
        seasonsLabel: "Seasons",
        votes: "Votes",
        imdbRating: "IMDb Rating",
        viewOnImdb: "View on IMDb",
        checkArchives: "CHECK ARCHIVES",
        highestRated: "Highest Rated",
        lowestRated: "Lowest Rated",
    },
    hi: {
        season: "सीज़न",
        episode: "एपिसोड",
        avg: "औसत",
        trendingWorld: "दुनिया भर में लोकप्रिय",
        trendingIndia: "भारत में लोकप्रिय",
        loading: "लोड हो रहा है...",
        dataProvidedBy: "TVMaze और IMDb द्वारा डेटा",
        searchPlaceholder: "tv सीरीज खोजें...",
        act: "अंक",
        scene: "दृश्य",
        best: "सर्वश्रेष्ठ",
        worst: "सबसे खराब",
        seriesNotFound: "सीरीज नहीं मिली!",
        errorFetching: "डेटा लाने में त्रुटि",
        criticsRating: "आलोचकों की रेटिंग",
        masterpiece: "उत्कृष्ट कृति",
        viewProgram: "प्रोग्राम देखें",
        seasonsLabel: "सीज़न",
        votes: "वोट",
        imdbRating: "IMDb रेटिंग",
        viewOnImdb: "IMDb पर देखें",
        checkArchives: "अभिलेख देखें",
        highestRated: "सबसे ज्यादा रेटेड",
        lowestRated: "सबसे कम रेटेड",
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "hi" : "en"));
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t: translations[language],
                toggleLanguage,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
