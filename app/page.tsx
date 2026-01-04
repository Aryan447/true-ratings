"use client";
import { useState, useEffect } from "react";
import SearchOverlay from "./components/SearchOverlay";
import SeriesInfo from "./components/SeriesInfo";
import EpisodeGrid from "./components/EpisodeGrid";
import RatingChart from "./components/RatingChart";
import TrendingRow from "./components/TrendingRow";
import { getSeriesData, getTrendingSeries } from "./actions/getSeriesData";
import { useLanguage } from "./context/LanguageContext"; // Import useLanguage

import { SeriesData, Episode, SearchResult } from "./types";

// Curated IDs for Trending Sections
const WORLD_IDS = [82, 169, 2993, 15299, 16121, 1371, 66, 431, 305]; // GoT, BB, Stranger Things, The Boys, Succession, Westworld, Big Bang, Friends, Black Mirror
const INDIA_IDS = [36082, 39537, 42878, 50824, 47353, 33368, 62237]; // Sacred Games, Mirzapur, Family Man, Scam 1992, Panchayat, Made in Heaven, Farzi

export default function Home() {
  const [series, setSeries] = useState<SeriesData | null>(null);
  const [seasons, setSeasons] = useState<{ [key: number]: Episode[] }>({});
  const [loading, setLoading] = useState(false);
  const [globalBest, setGlobalBest] = useState<{ season: number; ep: Episode } | null>(null);
  const [globalWorst, setGlobalWorst] = useState<{ season: number; ep: Episode } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [worldTrending, setWorldTrending] = useState<SearchResult[]>([]);
  const [indiaTrending, setIndiaTrending] = useState<SearchResult[]>([]);

  const { t, toggleLanguage, language } = useLanguage(); // Use hook

  // Fetch Trending Data on Mount
  useEffect(() => {
    const fetchTrending = async () => {
      const [world, india] = await Promise.all([
        getTrendingSeries(WORLD_IDS),
        getTrendingSeries(INDIA_IDS)
      ]);
      setWorldTrending(world);
      setIndiaTrending(india);
    };
    fetchTrending();
  }, []);

  // Focus on top of page when results load
  useEffect(() => {
    if (series) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [series]);

  const fetchSeries = async (title: string) => {
    setLoading(true);
    setSeries(null);
    setSeasons({});
    setGlobalBest(null);
    setGlobalWorst(null);
    setHasSearched(true);

    try {
      const data = await getSeriesData(title);
      if (data) {
        setSeries(data);
        setSeasons(data.seasons);
        setGlobalBest(data.BestEp);
        setGlobalWorst(data.WorstEp);
      } else {
        alert(t.seriesNotFound);
      }
    } catch (e) {
      console.error(e);
      alert(t.errorFetching);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen py-8 px-4 flex flex-col items-center relative">
      <button
        onClick={toggleLanguage}
        className="absolute top-4 right-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
      >
        {language === "en" ? "हिंदी" : "English"}
      </button>

      <SearchOverlay
        onSearch={fetchSeries}
        loading={loading}
        hasSearched={hasSearched}
      />

      {/* Show Trending Rows only if NOT searching/viewing results */}
      {!hasSearched && !loading && (
        <div className="w-full animate-fade-in mt-10">
          {worldTrending.length > 0 && (
            <TrendingRow title={t.trendingWorld} items={worldTrending} onSelect={fetchSeries} />
          )}
          {indiaTrending.length > 0 && (
            <TrendingRow title={t.trendingIndia} items={indiaTrending} onSelect={fetchSeries} />
          )}
        </div>
      )}

      {loading && hasSearched && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      )}

      {series && !loading && (
        <div className="animate-fade-in w-full flex flex-col items-center">
          <SeriesInfo
            series={series}
            globalBest={globalBest}
            globalWorst={globalWorst}
          />

          <RatingChart seasons={seasons} />

          <EpisodeGrid
            seasons={seasons}
            globalBest={globalBest}
            globalWorst={globalWorst}
          />
        </div>
      )}

      <footer className="mt-20 text-gray-600 text-sm pb-8">
        {t.dataProvidedBy}
      </footer>
    </main>
  );
}
