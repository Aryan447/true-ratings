"use client";
import { useState, useEffect } from "react";

const API_KEY = "a987f1ef";

interface Episode {
    Episode: string;
    imdbRating: string;
    Title: string;
    imdbID: string;
}

export default function Home() {
    const [query, setQuery] = useState("");
    const [series, setSeries] = useState<any>(null);
    const [seasons, setSeasons] = useState<{ [key: number]: Episode[] }>({});
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [globalBest, setGlobalBest] = useState<{ season: number; ep: Episode } | null>(null);
    const [globalWorst, setGlobalWorst] = useState<{ season: number; ep: Episode } | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("searchHistory");
        if (stored) setHistory(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        const debounce = setTimeout(async () => {
            const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=series&apikey=${API_KEY}`);
            const data = await res.json();
            setSuggestions(data.Search?.map((i: any) => i.Title) || []);
        }, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const fetchSeries = async (title: string) => {
        setLoading(true);
        setSeries(null);
        setSeasons({});
        setGlobalBest(null);
        setGlobalWorst(null);
        setSuggestions([]);
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
                for (let s = 1; s <= total; s++) {
                    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(data.Title)}&Season=${s}&apikey=${API_KEY}`);
                    const sea = await res.json();
                    if (sea.Episodes) {
                        setSeasons(prev => ({ ...prev, [s]: sea.Episodes }));
                        sea.Episodes.forEach((ep: Episode) => {
                            const r = parseFloat(ep.imdbRating);
                            if (!isNaN(r)) {
                                if (r > bestRating) {
                                    bestRating = r;
                                    bestEp = { season: s, ep };
                                }
                                if (r < worstRating) {
                                    worstRating = r;
                                    worstEp = { season: s, ep };
                                }
                            }
                        });
                    }
                }
                setGlobalBest(bestEp);
                setGlobalWorst(worstEp);
                if (!history.includes(title)) setHistory([title, ...history].slice(0, 10));
            }
        } catch { alert("Error"); }
        setLoading(false);
    };

    const clearHistory = () => setHistory([]);

    const getColor = (r: number) => {
        if (r >= 9.0) return "bg-green-600";
        if (r >= 8.5) return "bg-green-500";
        if (r >= 8.0) return "bg-green-400";
        if (r >= 7.5) return "bg-yellow-500";
        if (r >= 7.0) return "bg-yellow-600";
        if (r >= 6.0) return "bg-orange-600";
        return "bg-red-600";
    };

    const getSeasonAvg = (episodes: Episode[]) => {
        const ratings = episodes.map(e => parseFloat(e.imdbRating)).filter(r => !isNaN(r));
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A";
    };

    const getSeasonBest = (episodes: Episode[]) => {
        let best = null;
        let max = -1;
        episodes.forEach(ep => {
            const r = parseFloat(ep.imdbRating);
            if (!isNaN(r) && r > max) {
                max = r;
                best = { ep, rating: r };
            }
        });
        return best;
    };

    const getSeasonWorst = (episodes: Episode[]) => {
        let worst = null;
        let min = 11;
        episodes.forEach(ep => {
            const r = parseFloat(ep.imdbRating);
            if (!isNaN(r) && r < min) {
                min = r;
                worst = { ep, rating: r };
            }
        });
        return worst;
    };

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">Series Ratings</h1>

            <div className="max-w-2xl mx-auto relative mb-6">
                <input
                    type="text"
                    placeholder="Search series..."
                    className="w-full p-3 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && query && fetchSeries(query)}
                />
                {suggestions.length > 0 && (
                    <ul className="absolute w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                        {suggestions.map(s => (
                            <li key={s} className="p-3 hover:bg-gray-700 cursor-pointer" onClick={() => { setQuery(s); fetchSeries(s); }}>
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {history.length > 0 && (
                <div className="max-w-2xl mx-auto mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-semibold">Recent Searches</h2>
                        <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300">
                            Clear History
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {history.map(h => (
                            <button key={h} className="px-3 py-1 bg-gray-800 rounded-full text-sm" onClick={() => fetchSeries(h)}>
                                {h}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading && <p className="text-center">Loading...</p>}

            {series && !loading && (
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
                        <img src={series.Poster} alt={series.Title} className="w-48 rounded-lg shadow-lg" />
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{series.Title}</h2>
                            <p className="text-gray-400">{series.Year}</p>
                            <p className="mt-2 text-yellow-400 font-semibold">
                                ⭐ {series.imdbRating} ({series.imdbVotes})
                            </p>
                            <div className="flex gap-3 mt-3">
                                <a href={`https://www.imdb.com/title/${series.imdbID}`} target="_blank" rel="noopener noreferrer"
                                    className="px-4 py-1 bg-yellow-500 text-black rounded text-sm font-medium hover:bg-yellow-400">
                                    Read More
                                </a>
                                <button className="text-pink-500 text-sm">Save as image</button>
                            </div>
                        </div>
                    </div>

                    {globalBest && (
                        <p className="mb-3 text-green-400 font-medium text-center text-lg">
                            Series Best: S{globalBest.season}E{globalBest.ep.Episode} "{globalBest.ep.Title}" — {parseFloat(globalBest.ep.imdbRating).toFixed(1)}
                        </p>
                    )}
                    {globalWorst && (
                        <p className="mb-6 text-red-400 font-medium text-center text-lg">
                            Series Worst: S{globalWorst.season}E{globalWorst.ep.Episode} "{globalWorst.ep.Title}" — {parseFloat(globalWorst.ep.imdbRating).toFixed(1)}
                        </p>
                    )}

                    <div className="space-y-6">
                        {Object.entries(seasons).map(([season, episodes]) => {
                            const avg = getSeasonAvg(episodes);
                            const best = getSeasonBest(episodes);
                            const worst = getSeasonWorst(episodes);
                            return (
                                <div key={season} className="bg-gray-900 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold text-lg">Season {season}</h3>
                                        <span className="text-yellow-400 font-medium">Avg: {avg}</span>
                                    </div>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                        {episodes.map((ep, i) => {
                                            const rating = parseFloat(ep.imdbRating);
                                            const isSeasonBest = best?.ep.imdbID === ep.imdbID;
                                            const isSeasonWorst = worst?.ep.imdbID === ep.imdbID;
                                            const isGlobalBest = globalBest?.ep.imdbID === ep.imdbID;
                                            const isGlobalWorst = globalWorst?.ep.imdbID === ep.imdbID; return (
                                                <div
                                                    key={i}
                                                    className={`p-2 rounded text-center font-medium text-sm relative ${isNaN(rating) ? "bg-gray-700" : getColor(rating)
                                                        } ${isSeasonBest || isGlobalBest || isSeasonWorst || isGlobalWorst ? "ring-2 ring-white" : ""}`}
                                                >
                                                    {isSeasonBest && !isGlobalBest && (
                                                        <div className="text-[12px] leading-tight mb-1 text-white">
                                                            Highest Rated
                                                        </div>
                                                    )}
                                                    {isGlobalBest && (
                                                        <div className="text-[12px] leading-tight mb-1 text-green-300 font-bold">
                                                            SERIES BEST
                                                        </div>
                                                    )}
                                                    {isSeasonWorst && !isGlobalWorst && (
                                                        <div className="text-[12px] leading-tight mb-1 text-white">
                                                            Lowest Rated
                                                        </div>
                                                    )}
                                                    {isGlobalWorst && (
                                                        <div className="text-[12px] leading-tight mb-1 text-red-300 font-bold">
                                                            SERIES WORST
                                                        </div>
                                                    )}
                                                    E{ep.Episode}<br />
                                                    {isNaN(rating) ? "N/A" : rating.toFixed(1)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
