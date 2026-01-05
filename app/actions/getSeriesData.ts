"use server";
import axios from "axios";
import * as cheerio from "cheerio";

import { SeriesData, Episode, SearchResult } from "../types";

// Helper to scrape accurate ratings from IMDb Season pages
async function getImdbSeasonRatings(imdbID: string, season: number): Promise<{ [ep: string]: string }> {
    try {
        const url = `https://www.imdb.com/title/${imdbID}/episodes/?season=${season}`;
        const res = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
            },
            validateStatus: () => true
        });

        if (res.status !== 200) return {};

        const $ = cheerio.load(res.data);
        const nextData = $("#__NEXT_DATA__").html();
        if (!nextData) return {};

        const json = JSON.parse(nextData);
        // Path to episodes: props.pageProps.contentData.section.episodes.items
        const episodes = json.props?.pageProps?.contentData?.section?.episodes?.items;

        const ratingsMap: { [ep: string]: string } = {};

        if (Array.isArray(episodes)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            episodes.forEach((ep: any) => {
                // IMDb field can be 'episodeNumber' or just 'episode'
                const epNum = ep.episodeNumber?.toString() || ep.episode?.toString();
                // aggregateRating might be nested or direct
                const rating = ep.aggregateRating || ep.rating?.aggregateRating || 0;
                if (epNum && rating) {
                    ratingsMap[epNum] = rating.toString();
                }
            });
        }

        return ratingsMap;
    } catch (e) {
        // Silent failure - fallback to TVMaze
        return {};
    }
}

export async function getSeriesData(query: string): Promise<SeriesData | null> {
    try {
        console.log(`Searching TVMaze for: ${query}`);
        // 1. Fetch Metadata from TVMaze (Fast & Reliable)
        const url = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}&embed[]=episodes&embed[]=cast`;
        const res = await axios.get(url, { validateStatus: () => true });

        if (res.status === 404) return null;
        if (res.status !== 200) throw new Error(`TVMaze API Error: ${res.status}`);

        const show = res.data;
        const episodesRaw = show._embedded?.episodes || [];
        const castRaw = show._embedded?.cast || [];
        const imdbID = show.externals?.imdb;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalSeasons = Math.max(...episodesRaw.map((e: any) => e.season));

        // 2. Fetch IMDb Ratings in Parallel (Accurate)
        const imdbRatings: { [key: string]: string } = {}; // Use const because we mutate the object, not reassignment
        if (imdbID) {
            console.log(`Fetching true IMDb ratings for ${imdbID} (${totalSeasons} seasons)...`);
            const seasonPromises = [];
            for (let i = 1; i <= totalSeasons; i++) {
                seasonPromises.push(
                    getImdbSeasonRatings(imdbID, i).then(ratings => ({ season: i, ratings }))
                );
            }
            const results = await Promise.all(seasonPromises);
            results.forEach(r => {
                Object.entries(r.ratings).forEach(([epNum, rating]) => {
                    imdbRatings[`S${r.season}E${epNum}`] = rating as string;
                });
            });
        }

        // 3. Map Data & Merge
        const title = show.name;
        const year = show.premiered ? show.premiered.split("-")[0] : "";
        const plot = show.summary ? show.summary.replace(/<[^>]*>?/gm, "") : "No summary available.";
        const poster = show.image?.original || show.image?.medium || "";
        const seriesRating = show.rating?.average?.toString() || "N/A";
        const votes = "N/A";

        const status = show.status || "Unknown";
        const averageRuntime = show.averageRuntime || 30;
        const genres = show.genres || [];
        const officialSite = show.officialSite || "";
        const network = show.network?.name || show.webChannel?.name || "";

        // Map Cast
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cast = castRaw.map((c: any) => ({
            id: c.person.id,
            name: c.person.name,
            character: c.character.name,
            image: c.person.image?.medium || c.character.image?.medium || "",
            url: c.person.url
        })).slice(0, 10); // Top 10 cast members

        const seasonsData: { [key: number]: Episode[] } = {};
        let globalBestRating = -1;
        let globalWorstRating = 11;
        let bestEp: { season: number; ep: Episode } | null = null;
        let worstEp: { season: number; ep: Episode } | null = null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        episodesRaw.forEach((ep: any) => {
            const s = ep.season;
            if (!s) return;

            const epNum = ep.number?.toString() || "0";
            const epTitle = ep.name;

            // Prefer IMDb Rating if available, else TVMaze
            const key = `S${s}E${epNum}`;
            const finalRating = imdbRatings[key] || (ep.rating?.average ? ep.rating.average.toString() : "N/A");

            const epObj: Episode = {
                Episode: epNum,
                imdbRating: finalRating,
                Title: epTitle,
                imdbID: ep.id.toString(), // TVMaze ID as fallback ID
                season: s
            };

            if (!seasonsData[s]) seasonsData[s] = [];
            seasonsData[s].push(epObj);

            const ratingVal = parseFloat(finalRating);
            if (!isNaN(ratingVal)) {
                if (ratingVal > globalBestRating) {
                    globalBestRating = ratingVal;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    bestEp = { season: s, ep: epObj } as any;
                }
                if (ratingVal < globalWorstRating) {
                    globalWorstRating = ratingVal;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    worstEp = { season: s, ep: epObj } as any;
                }
            }
        });

        return {
            Title: title,
            Year: year,
            Plot: plot,
            Poster: poster,
            imdbRating: seriesRating,
            imdbVotes: votes,
            imdbID: imdbID || show.id.toString(),
            totalSeasons: totalSeasons.toString(),
            seasons: seasonsData,
            BestEp: bestEp,
            WorstEp: worstEp,
            status,
            averageRuntime,
            genres,
            officialSite,
            network,
            cast
        };

    } catch (error) {
        console.error("Data Fetch Error:", error);
        return null;
    }
}

export async function searchSeries(query: string): Promise<SearchResult[]> {
    try {
        if (!query || query.length < 2) return [];
        const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
        const res = await axios.get(url, { validateStatus: () => true });
        if (res.status !== 200) return [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return res.data.map((item: any) => ({
            id: item.show.id,
            title: item.show.name,
            year: item.show.premiered ? item.show.premiered.split("-")[0] : "",
            rating: item.show.rating?.average || "N/A",
            poster: item.show.image?.medium || "",
        })).slice(0, 7);
    } catch (e) {
        console.error("Search error:", e);
        return [];
    }
}

export async function getTrendingSeries(ids: number[]): Promise<SearchResult[]> {
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
        } catch (e) { return null; }
    });
    const results = await Promise.all(promises);
    return results.filter(r => r !== null);
}
