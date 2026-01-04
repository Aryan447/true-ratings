"use client";
import { useState, useEffect } from "react";
import SearchHero from "./components/SearchHero";
import SeriesInfo from "./components/SeriesInfo";
import EpisodeGrid from "./components/EpisodeGrid";
import RatingChart from "./components/RatingChart";

const API_KEY = "a987f1ef";

interface Episode {
  Episode: string;
  imdbRating: string;
  Title: string;
  imdbID: string;
}

export default function Home() {
  const [series, setSeries] = useState<any>(null);
  const [seasons, setSeasons] = useState<{ [key: number]: Episode[] }>({});
  const [loading, setLoading] = useState(false);
  const [globalBest, setGlobalBest] = useState<{ season: number; ep: Episode } | null>(null);
  const [globalWorst, setGlobalWorst] = useState<{ season: number; ep: Episode } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
      const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
      const data = await res.json();
      if (data.Type === "series") {
        setSeries(data);
        const total = parseInt(data.totalSeasons);
        let bestRating = -1;
        let worstRating = 11;
        let bestEp: { season: number; ep: Episode } | null = null;
        let worstEp: { season: number; ep: Episode } | null = null;
        const allSeasonsData: { [key: number]: Episode[] } = {};

        // Parallel fetch for speed
        const seasonPromises = [];
        for (let s = 1; s <= total; s++) {
          seasonPromises.push(
            fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(data.Title)}&Season=${s}&apikey=${API_KEY}`)
              .then(r => r.json())
              .then(sea => ({ season: s, data: sea }))
          );
        }

        const results = await Promise.all(seasonPromises);

        results.forEach(({ season, data: sea }) => {
          if (sea.Episodes) {
            allSeasonsData[season] = sea.Episodes;
            sea.Episodes.forEach((ep: Episode) => {
              const r = parseFloat(ep.imdbRating);
              if (!isNaN(r)) {
                if (r > bestRating) {
                  bestRating = r;
                  bestEp = { season, ep };
                }
                if (r < worstRating) {
                  worstRating = r;
                  worstEp = { season, ep };
                }
              }
            });
          }
        });

        setSeasons(allSeasonsData);
        setGlobalBest(bestEp);
        setGlobalWorst(worstEp);
      } else {
        // Handle non-series or not found
        alert("Series not found or not a TV series!");
        setHasSearched(false);
      }
    } catch {
      alert("Error fetching data");
      setHasSearched(false);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen py-8 px-4 flex flex-col items-center">
      {/* Search Header - shows centered if no search, otherwise minimal at top (could act as reset) */}
      {!hasSearched ? (
        <SearchHero onSearch={fetchSeries} loading={loading} />
      ) : (
        <div className="w-full max-w-6xl mx-auto mb-8 flex justify-between items-center animate-fade-in">
          <h1
            className="text-2xl font-bold cursor-pointer text-gradient"
            onClick={() => { setSeries(null); setHasSearched(false); }}
          >
            True Ratings
          </h1>
          <button
            onClick={() => { setSeries(null); setHasSearched(false); }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Start Over
          </button>
        </div>
      )}

      {loading && (
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

      <footer className="mt-20 text-gray-600 text-sm">
        Data provided by OMDb API
      </footer>
    </main>
  );
}
