import axios from "axios";
import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function testImdbSeason() {
    try {
        const imdbID = "tt0944947"; // Game of Thrones
        const url = `https://www.imdb.com/title/${imdbID}/episodes/?season=1`;

        console.log(`Fetching ${url}...`);
        const res = await axios.get(url, {
            headers: {
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5"
            },
            validateStatus: () => true
        });

        console.log(`Status: ${res.status}`);
        if (res.status === 200) {
            const $ = cheerio.load(res.data);

            // Try new 2024 Selectors
            const episodes = $(".ipc-metadata-list-summary-item");
            console.log(`Found ${episodes.length} episodes via IPC selector.`);

            if (episodes.length > 0) {
                const firstEspisode = episodes.first();
                const title = firstEspisode.find(".ipc-title__text").text();
                const rating = firstEspisode.find(".ipc-rating-star--base").text();
                // Rating often comes as "8.9 (34K)" or similar text, need to parse
                console.log(`Ep 1 Title: ${title}`);
                console.log(`Ep 1 Rating Raw: ${rating}`);
            } else {
                // Fallback to older styling just in case
                const olderEps = $(".list_item");
                console.log(`Found ${olderEps.length} episodes via legacy selector.`);
            }

            // Dump a bit of HTML if zero found
            if (episodes.length === 0) {
                console.log("Snippet:", res.data.substring(0, 1000));
            }

        } else {
            console.log("Blocked.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

testImdbSeason();
