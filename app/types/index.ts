export interface Episode {
    Episode: string;
    imdbRating: string;
    Title: string;
    imdbID: string;
    season?: number;
}

export interface SeriesData {
    Title: string;
    Year: string;
    Plot: string;
    Poster: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    totalSeasons: string;
    seasons: { [key: number]: Episode[] };
    BestEp: { season: number; ep: Episode } | null;
    WorstEp: { season: number; ep: Episode } | null;
}

export interface SearchResult {
    id: number;
    title: string;
    year: string;
    rating: number | string;
    poster: string;
}
