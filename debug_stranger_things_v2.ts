import axios from "axios";
import * as cheerio from "cheerio";

async function getImdbSeasonRatings(imdbID: string, season: number) {
    console.log(`Scraping IMDb: ${imdbID} Season ${season}`);
    try {
        const url = `https://www.imdb.com/title/${imdbID}/episodes/?season=${season}`;
        const res = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
            },
            validateStatus: () => true
        });

        if (res.status !== 200) {
            console.log("IMDb returned status:", res.status);
            return {};
        }

        const $ = cheerio.load(res.data);
        const nextData = $("#__NEXT_DATA__").html();
        if (!nextData) {
            console.log("No __NEXT_DATA__ found");
            return {};
        }

        const json = JSON.parse(nextData);
        // Path to episodes: props.pageProps.contentData.section.episodes.items
        const episodes = json.props?.pageProps?.contentData?.section?.episodes?.items;

        const ratingsMap: { [ep: string]: string } = {};

        if (Array.isArray(episodes)) {
            console.log(`Found ${episodes.length} episodes in JSON`);
            episodes.forEach((ep: any) => {
                const epNum = ep.episodeNumber?.toString();
                // Check multiple possible locations for rating
                const rating = ep.aggregateRating || ep.rating?.aggregateRating || 0;
                console.log(`Ep ${epNum}: Rating=${rating}`);
                if (epNum && rating) {
                    ratingsMap[epNum] = rating.toString();
                }
            });
        }

        return ratingsMap;
    } catch (e) {
        console.error("Error scraping:", e);
        return {};
    }
}

async function debug() {
    // Stranger Things IMDb ID: tt4574334
    // Season 5
    const ratings = await getImdbSeasonRatings("tt4574334", 5);
    console.log("Final Ratings Map:", ratings);
}

debug();
