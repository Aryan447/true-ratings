import axios from "axios";
import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

async function testVideo() {
    try {
        console.log("Testing IMDb Access...");
        const searchUrl = `https://www.imdb.com/find/?q=Game%20of%20Thrones&s=tt&ttype=tv`;
        const res = await axios.get(searchUrl, {
            headers: { "User-Agent": USER_AGENT },
            validateStatus: () => true
        });

        console.log(`Status: ${res.status}`);
        if (res.status === 200) {
            const $ = cheerio.load(res.data);
            const firstResult = $(".ipc-metadata-list-summary-item__t").first().text();
            console.log(`First Result Text: "${firstResult}"`);

            if (!firstResult) {
                console.log("Parsing failed. Selectors might be wrong or content is dynamic (JS-only).");
                console.log("HTML Preview:", res.data.substring(0, 500));
            }
        } else {
            console.log("Blocked/Error.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

testVideo();
