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
    status: string;
    averageRuntime: number;
    genres: string[];
    officialSite?: string;
    network?: string;
    cast: CastMember[];
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    image: string;
    url: string;
}

export interface SearchResult {
    id: number;
    title: string;
    year: string;
    rating: number | string;
    poster: string;
}
