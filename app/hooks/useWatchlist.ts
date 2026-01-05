import { useState, useEffect } from 'react';
import { SearchResult } from '../types';

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<SearchResult[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('true_ratings_watchlist');
        if (saved) {
            setWatchlist(JSON.parse(saved));
        }
    }, []);

    const addToWatchlist = (series: SearchResult) => {
        const updated = [...watchlist, series];
        setWatchlist(updated);
        localStorage.setItem('true_ratings_watchlist', JSON.stringify(updated));
    };

    const removeFromWatchlist = (seriesId: number) => {
        const updated = watchlist.filter(s => s.id !== seriesId);
        setWatchlist(updated);
        localStorage.setItem('true_ratings_watchlist', JSON.stringify(updated));
    };

    const isInWatchlist = (seriesId: number) => {
        return watchlist.some(s => s.id === seriesId);
    };

    return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}
