"use server";
import axios from "axios";

interface Episode {
    Episode: string;
    imdbRating: string;
    Title: string;
    imdbID: string;
    season?: number;
}

interface SeriesData {
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

export async function getSeriesData(query: string): Promise<SeriesData | null> {
    try {
        console.log(`Searching TVMaze for: ${query}`);
        // TVMaze Single Search with embedded episodes
        const url = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}&embed=episodes`;
        const res = await axios.get(url, { validateStatus: () => true });

        if (res.status === 404) return null;
        if (res.status !== 200) throw new Error(`TVMaze API Error: ${res.status}`);

        const show = res.data;
        const episodesRaw = show._embedded?.episodes || [];

        // Map Show Data
        const title = show.name;
        const year = show.premiered ? show.premiered.split("-")[0] : "";
        const plot = show.summary ? show.summary.replace(/<[^>]*>?/gm, "") : "No summary available.";
        const poster = show.image?.original || show.image?.medium || "";
        const rating = show.rating?.average?.toString() || "N/A";
        const votes = "N/A"; // TVMaze doesn't provide vote count in this endpoint easily
        const imdbID = show.externals?.imdb || show.id.toString();

        // Map Seasons
        const seasonsData: { [key: number]: Episode[] } = {};
        let globalBestRating = -1;
        let globalWorstRating = 11;
        let bestEp: any = null;
        let worstEp: any = null;
        let maxSeason = 0;

        episodesRaw.forEach((ep: any) => {
            const s = ep.season;
            if (!s) return;
            if (s > maxSeason) maxSeason = s;

            const epNum = ep.number?.toString() || "0";
            const epTitle = ep.name;
            const epRating = ep.rating?.average ? ep.rating.average.toString() : "N/A";
            const epId = ep.id.toString();

            const ratingVal = parseFloat(epRating);
            const epObj: Episode = {
                Episode: epNum,
                imdbRating: epRating,
                Title: epTitle,
                imdbID: epId,
                season: s
            };

            if (!seasonsData[s]) seasonsData[s] = [];
            seasonsData[s].push(epObj);

            if (!isNaN(ratingVal)) {
                if (ratingVal > globalBestRating) {
                    globalBestRating = ratingVal;
                    bestEp = { season: s, ep: epObj };
                }
                if (ratingVal < globalWorstRating) {
                    globalWorstRating = ratingVal;
                    worstEp = { season: s, ep: epObj };
                }
            }
        });

        return {
            Title: title,
            Year: year,
            Plot: plot,
            Poster: poster,
            imdbRating: rating,
            imdbVotes: votes,
            imdbID: imdbID,
            totalSeasons: maxSeason.toString(),
            seasons: seasonsData,
            BestEp: bestEp,
            WorstEp: worstEp
        };

    } catch (error) {
        console.error("TVMaze API error:", error);
        return null;
    }
}

export async function searchSeries(query: string): Promise<any[]> {
    try {
        if (!query || query.length < 2) return [];
        const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
        const res = await axios.get(url, { validateStatus: () => true });

        if (res.status !== 200) return [];

        return res.data.map((item: any) => ({
            id: item.show.id,
            title: item.show.name,
            year: item.show.premiered ? item.show.premiered.split("-")[0] : "",
            rating: item.show.rating?.average || "N/A",
            poster: item.show.image?.medium || "",
        })).slice(0, 7); // Limit to top 7 results
    } catch (e) {
        console.error("Search error:", e);
        return [];
    }
}

export async function getTrendingSeries(ids: number[]): Promise<any[]> {
    const promises = ids.map(async (id) => {
        try {
            const res = await axios.get(`https://api.tvmaze.com/shows/${id}`, { validateStatus: () => true });
            if (res.status !== 200) return null;
            const show = res.data;
            return {
                id: show.id,
                title: show.name,
                poster: show.image?.medium || "",
                rating: show.rating?.average || "N/A",
                year: show.premiered ? show.premiered.split("-")[0] : "",
            };
        } catch (e) {
            return null;
        }
    });

    const results = await Promise.all(promises);
    return results.filter(r => r !== null);
}
