"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchOverlay from "./components/SearchOverlay";
import SeriesInfo from "./components/SeriesInfo";
import EpisodeGrid from "./components/EpisodeGrid";
import RatingChart from "./components/RatingChart";
import TrendingRow from "./components/TrendingRow";
import SeriesSkeleton from "./components/Skeletons";
import { getSeriesData, getTrendingSeries } from "./actions/getSeriesData";
import { useLanguage } from "./context/LanguageContext";
import HeaderControls from "./components/HeaderControls";
import BackToTop from "./components/BackToTop";

import { SeriesData, Episode, SearchResult } from "./types";

// Curated IDs for Trending Sections
const WORLD_IDS = [82, 169, 2993, 15299, 16121, 1371, 66, 431, 305];
const INDIA_IDS = [36082, 39537, 42878, 50824, 47353, 33368, 62237];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [series, setSeries] = useState<SeriesData | null>(null);
  const [seasons, setSeasons] = useState<{ [key: number]: Episode[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalBest, setGlobalBest] = useState<{ season: number; ep: Episode } | null>(null);
  const [globalWorst, setGlobalWorst] = useState<{ season: number; ep: Episode } | null>(null);

  const [worldTrending, setWorldTrending] = useState<SearchResult[]>([]);
  const [indiaTrending, setIndiaTrending] = useState<SearchResult[]>([]);

  const { t, toggleLanguage, language } = useLanguage();

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

  // Sync state with URL query
  useEffect(() => {
    if (query) {
      fetchSeries(query);
    } else {
      // Reset if no query (e.g. back to home)
      setSeries(null);
      setSeasons({});
      setError(null);
    }
  }, [query]);

  // Focus on top of page when results load
  useEffect(() => {
    if (series || loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [series, loading]);

  const fetchSeries = async (title: string) => {
    setLoading(true);
    setError(null);
    setSeries(null); // Clear previous results immediately for skeleton view

    try {
      const data = await getSeriesData(title);
      if (data) {
        setSeries(data);
        setSeasons(data.seasons);
        setGlobalBest(data.BestEp);
        setGlobalWorst(data.WorstEp);
      } else {
        setError(t.seriesNotFound);
      }
    } catch (e) {
      console.error(e);
      setError(t.errorFetching);
    }
    setLoading(false);
  };

  const handleSearch = (title: string) => {
    // Update URL, which triggers the effect
    router.push(`/?q=${encodeURIComponent(title)}`);
  };

  // Determine if we should show the "searched" layout
  const hasSearched = !!query;

  return (
    <main className="min-h-screen py-8 px-4 flex flex-col items-center relative">
      <HeaderControls />


      <SearchOverlay
        onSearch={handleSearch}
        loading={loading}
        hasSearched={hasSearched}
      />

      {/* Show Trending Rows only if NOT searching/viewing results */}
      {!hasSearched && !loading && (
        <div className="w-full animate-fade-in mt-10">
          {worldTrending.length > 0 && (
            <TrendingRow title={t.trendingWorld} items={worldTrending} onSelect={handleSearch} />
          )}
          {indiaTrending.length > 0 && (
            <TrendingRow title={t.trendingIndia} items={indiaTrending} onSelect={handleSearch} />
          )}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && hasSearched && <SeriesSkeleton />}

      {/* Error Message */}
      {error && !loading && (
        <div className="mt-10 p-6 bg-red-900/20 border border-red-500/50 rounded-lg text-center animate-fade-in">
          <p className="text-xl text-red-400 font-bold mb-2">Error</p>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-sm text-white/50 hover:text-white underline"
          >
            Go Home
          </button>
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
      <BackToTop />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
