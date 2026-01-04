import axios from "axios";
import * as cheerio from "cheerio";

async function debugObject() {
    try {
        const url = `https://www.imdb.com/title/tt4574334/episodes/?season=5`;
        const res = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) width=device-width" }
        });

        const $ = cheerio.load(res.data);
        const nextData = $("#__NEXT_DATA__").html();
        if (nextData) {
            const json = JSON.parse(nextData);
            const episodes = json.props?.pageProps?.contentData?.section?.episodes?.items;
            if (episodes && episodes.length > 0) {
                console.log("Sample Episode Object:", JSON.stringify(episodes[6], null, 2)); // Check ep 7 (index 6)
            }
        }
    } catch (e) {
        console.error(e);
    }
}

debugObject();
