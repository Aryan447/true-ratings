"use server";
import axios from "axios";
import * as cheerio from "cheerio";

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

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

export async function getSeriesData(query: string): Promise<SeriesData | null> {
    try {
        // 1. Search for the series
        console.log(`Searching for: ${query}`);
        const searchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(query)}&s=tt&ttype=tv`;
        const searchRes = await axios.get(searchUrl, { headers: { "User-Agent": USER_AGENT } });
        const $search = cheerio.load(searchRes.data);

        // Find first TV series result
        // New IMDb search layout uses simple lists
        const navUrl = $search(".ipc-metadata-list-summary-item__t").first().attr("href");
        if (!navUrl) return null;

        const imdbID = navUrl.split("/")[2]; // /title/tt1234567/...
        if (!imdbID) return null;

        // 2. Fetch Series Page for Metadata
        console.log(`Fetching series page: ${imdbID}`);
        const seriesUrl = `https://www.imdb.com/title/${imdbID}/`;
        const seriesRes = await axios.get(seriesUrl, { headers: { "User-Agent": USER_AGENT } });
        const $series = cheerio.load(seriesRes.data);

        const title = $series("h1").text().trim();
        // Try to get high res poster from generic meta tags
        const poster = $series('meta[property="og:image"]').attr("content") || "";
        const plot = $series('meta[name="description"]').attr("content") || "";
        const rating = $series('div[data-testid="hero-rating-bar__aggregate-rating__score"] span').first().text() || "N/A";
        const votes = $series('div[data-testid="hero-rating-bar__aggregate-rating__score"]').next().text().replace("votes", "").trim() || "N/A";
        const year = $series('a[href*="releaseinfo"]').first().text().trim() || "";

        // 3. Determine Total Seasons
        // Often found in a select dropdown or just try fetching season 1 to see availability
        // We can try to fetch season 1 and see the season list in there

        const season1Url = `https://www.imdb.com/title/${imdbID}/episodes?season=1`;
        const s1Res = await axios.get(season1Url, { headers: { "User-Agent": USER_AGENT } });
        const $s1 = cheerio.load(s1Res.data);

        // Get season numbers from the select dropdown
        const seasonNumbers: number[] = [];
        $s1("#bySeason option").each((_, el) => {
            const val = $s1(el).attr("value");
            if (val) seasonNumbers.push(parseInt(val));
        });

        if (seasonNumbers.length === 0) seasonNumbers.push(1); // Assume at least 1 if found none

        console.log(`Found seasons: ${seasonNumbers.join(", ")}`);

        // 4. Fetch All Seasons concurrently
        const seasonsData: { [key: number]: Episode[] } = {};
        let globalBestRating = -1;
        let globalWorstRating = 11;
        let bestEp: any = null;
        let worstEp: any = null;

        const seasonPromises = seasonNumbers.map(async (s) => {
            try {
                const url = `https://www.imdb.com/title/${imdbID}/episodes?season=${s}`;
                const res = await axios.get(url, { headers: { "User-Agent": USER_AGENT } });
                const $ = cheerio.load(res.data);

                const episodes: Episode[] = [];

                $(".list_item").each((_, el) => {
                    const epNum = $(el).find('[itemprop="episodeNumber"]').attr("content") || "0";
                    const epTitle = $(el).find('[itemprop="name"]').text().trim();
                    const epRating = $(el).find(".ipl-rating-star__rating").first().text().trim() || "N/A";
                    const epId = $(el).find(".image").find("a").attr("href")?.split("/")[2] || "";

                    const ratingVal = parseFloat(epRating);
                    const epObj = {
                        Episode: epNum,
                        imdbRating: epRating,
                        Title: epTitle,
                        imdbID: epId,
                        season: s
                    };

                    episodes.push(epObj);

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

                // Sort by episode number just in case
                episodes.sort((a, b) => parseInt(a.Episode) - parseInt(b.Episode));
                return { season: s, episodes };
            } catch (e) {
                console.error(`Failed to fetch season ${s}`, e);
                return { season: s, episodes: [] };
            }
        });

        const results = await Promise.all(seasonPromises);
        results.forEach(r => {
            if (r.episodes.length > 0) {
                seasonsData[r.season] = r.episodes;
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
            totalSeasons: seasonNumbers.length.toString(),
            seasons: seasonsData,
            BestEp: bestEp,
            WorstEp: worstEp
        };

    } catch (error) {
        console.error("Scraping error:", error);
        return null;
    }
}
