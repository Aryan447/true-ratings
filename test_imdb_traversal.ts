import axios from "axios";
import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function findEpisodesPath() {
    try {
        const url = "https://www.imdb.com/title/tt0944947/episodes/?season=1";
        const res = await axios.get(url, { headers: { "User-Agent": USER_AGENT } });
        const $ = cheerio.load(res.data);
        const nextData = $("#__NEXT_DATA__").html();

        if (nextData) {
            const json = JSON.parse(nextData);

            // Recursive search for an array that looks like episodes (has aggregateRating and episodeNumber)
            function search(obj: any, path: string = "") {
                if (!obj || typeof obj !== 'object') return;

                if (Array.isArray(obj)) {
                    // Check if items look like episodes
                    if (obj.length > 0 && obj[0]?.episodeNumber && obj[0]?.aggregateRating) {
                        console.log(`FOUND EPISODES at: ${path}`);
                        console.log("Sample:", JSON.stringify(obj[0], null, 2));
                    }
                    obj.forEach((item, i) => search(item, `${path}[${i}]`));
                } else {
                    Object.keys(obj).forEach(key => search(obj[key], `${path}.${key}`));
                }
            }

            // Limit depth to avoid stack overflow on huge objects, or just search known props
            // Actually, let's search specifically in pageProps which is standard
            console.log("Searching in props.pageProps...");

            // Shortcut: The data is usually in 'mainColumnData' or 'contentData'
            // Let's dump the structure of pageProps.contentData
            if (json.props?.pageProps?.contentData) {
                const data = json.props.pageProps.contentData;
                console.log("Top level keys in contentData:", Object.keys(data));

                // Usually section.items or similar
                if (data.section) {
                    console.log("Section keys:", Object.keys(data.section));
                }
            }

            // Also try explicit traversal
            // search(json.props?.pageProps); 
        }
    } catch (e) { console.error(e); }
}

findEpisodesPath();
