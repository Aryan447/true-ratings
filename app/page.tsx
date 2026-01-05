"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchOverlay from "./components/SearchOverlay";
import SeriesInfo from "./components/SeriesInfo";
import EpisodeGrid from "./components/EpisodeGrid";
import EpisodeModal from "./components/EpisodeModal"; // NEW
import RatingChart from "./components/RatingChart";
import TrendingRow from "./components/TrendingRow";
import SeriesSkeleton from "./components/Skeletons";
import { getSeriesData, getTrendingSeries } from "./actions/getSeriesData";
import { useLanguage } from "./context/LanguageContext";
import HeaderControls from "./components/HeaderControls";
import BackToTop from "./components/BackToTop";
import TopEpisodes from "./components/TopEpisodes";
import WatchlistRow from "./components/WatchlistRow";
import { useWatchlist } from "./hooks/useWatchlist";

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

  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const { t, toggleLanguage, language } = useLanguage();
  const { watchlist, removeFromWatchlist } = useWatchlist();

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

  const [comparisonSeries, setComparisonSeries] = useState<SeriesData | null>(null);
  const [comparisonSeasons, setComparisonSeasons] = useState<{ [key: number]: Episode[] } | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Focus on top of page when results load
  useEffect(() => {
    if (series || loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [series, loading]);

  const fetchSeries = async (title: string, isComparison = false) => {
    setLoading(true);
    setError(null);
    if (!isComparison) {
      setSeries(null); // Clear main series if standard search
      setComparisonSeries(null);
      setComparisonSeasons(null);
    }

    try {
      const data = await getSeriesData(title);
      if (data) {
        if (isComparison) {
          setComparisonSeries(data);
          setComparisonSeasons(data.seasons);
          setIsComparing(false); // Reset mode after selection
        } else {
          setSeries(data);
          setSeasons(data.seasons);
          setGlobalBest(data.BestEp);
          setGlobalWorst(data.WorstEp);
        }
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
    if (isComparing) {
      fetchSeries(title, true);
    } else {
      // Update URL, which triggers the effect
      router.push(`/?q=${encodeURIComponent(title)}`);
    }
  };

  const handleStartComparison = () => {
    setIsComparing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelComparison = () => {
    setIsComparing(false);
    if (comparisonSeries) {
      setComparisonSeries(null);
      setComparisonSeasons(null);
    }
  };

  // Scroll to Season (Handles both Dropdown and Grid)
  const handleScrollToSeason = (season: number) => {
    const element = document.getElementById(`season-${season}`);
    if (element) {
      const yOffset = -100; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Pick Random Episode
  const handleRandomEpisode = () => {
    if (!seasons) return;
    const allEpisodes = Object.entries(seasons).flatMap(([s, eps]) =>
      eps.map(e => ({ ...e, season: Number(s) }))
    );
    if (allEpisodes.length > 0) {
      const randomEp = allEpisodes[Math.floor(Math.random() * allEpisodes.length)];
      setSelectedEpisode(randomEp);
    }
  };

  // Determine if we should show the "searched" layout
  const hasSearched = !!query;

  return (
    <main className="min-h-screen pt-20 pb-8 px-4 flex flex-col items-center relative">
      <HeaderControls
        seasons={seasons}
        onScrollToSeason={handleScrollToSeason}
        onRandomEpisode={Object.keys(seasons).length > 0 ? handleRandomEpisode : undefined}
        showBack={!!series}
        onBack={() => {
          setSeries(null); // Clear loaded series
          router.push('/'); // Update URL
        }}
      />


      <SearchOverlay
        onSearch={handleSearch}
        loading={loading}
        hasSearched={hasSearched}
        mode={isComparing ? 'compare' : 'search'}
        onCancelCompare={handleCancelComparison}
      />

      {/* Show Trending & Watchlist Rows only if NOT searching/viewing results */}
      {!hasSearched && !loading && (
        <div className="w-full animate-fade-in mt-10">
          <WatchlistRow
            items={watchlist}
            onSelect={handleSearch}
            onRemove={removeFromWatchlist}
          />
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
            onCompare={handleStartComparison}
          />

          {comparisonSeries && (
            <div className="w-full max-w-6xl mb-8 p-4 bg-blue-900/10 border border-blue-500/50 rounded-lg flex justify-between items-center animate-fade-in">
              <div className="flex items-center gap-4">
                <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">VS</span>
                <div className="font-bold text-xl text-white">{comparisonSeries.Title}</div>
              </div>
              <button
                onClick={() => {
                  setComparisonSeries(null);
                  setComparisonSeasons(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          <TopEpisodes seasons={seasons} onSelectEpisode={setSelectedEpisode} />

          <RatingChart
            seasons={seasons}
            comparisonSeasons={comparisonSeasons || undefined}
            comparisonTitle={comparisonSeries?.Title}
          />

          <EpisodeGrid
            seasons={seasons}
            globalBest={globalBest}
            globalWorst={globalWorst}
            selectedEpisode={selectedEpisode}
            onSelectEpisode={setSelectedEpisode}
          />
        </div>
      )}

      <footer className="mt-20 text-gray-600 text-sm pb-8">
        {t.dataProvidedBy}
      </footer>
      <BackToTop />
      <EpisodeModal episode={selectedEpisode} onClose={() => setSelectedEpisode(null)} />
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
