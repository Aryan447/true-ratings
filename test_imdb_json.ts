import axios from "axios";
import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function testImdbJson() {
    try {
        const imdbID = "tt0944947"; // Game of Thrones
        const url = `https://www.imdb.com/title/${imdbID}/episodes/?season=1`;

        console.log(`Fetching ${url}...`);
        const res = await axios.get(url, {
            headers: {
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Referer": "https://www.google.com/"
            },
            validateStatus: () => true
        });

        if (res.status === 200) {
            const $ = cheerio.load(res.data);

            // Look for Next.js data
            const nextData = $("#__NEXT_DATA__").html();
            if (nextData) {
                console.log("Found __NEXT_DATA__!");
                const json = JSON.parse(nextData);
                // Navigate deeper... looking for episodes
                // This structure varies, need to explore. 
                // Usually props.pageProps.contentData...
                console.log("Keys:", Object.keys(json.props?.pageProps || {}));

                // Try to find episode list in a safe way (recursive search or known path)
                // For test, just dump size or top keys
                const stringified = JSON.stringify(json);
                const epCount = (stringified.match(/episodeNumber/g) || []).length;
                console.log(`Estimated Episode Count in JSON: ${epCount}`);

                // Try to find a rating
                const ratingMatch = stringified.match(/"aggregateRating":([\d\.]+)/);
                console.log(`Found Rating Pattern: ${ratingMatch?.[1]}`);
            } else {
                console.log("No __NEXT_DATA__ found.");
                // Try JSON-LD
                const jsonLd = $('script[type="application/ld+json"]').html();
                if (jsonLd) {
                    console.log("Found JSON-LD!");
                    console.log("Snippet:", jsonLd.substring(0, 200));
                }
            }

        } else {
            console.log(`Blocked: ${res.status}`);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

testImdbJson();
