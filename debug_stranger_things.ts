import { getSeriesData } from "./app/actions/getSeriesData";

async function debugStrangerThings() {
    console.log("Fetching Stranger Things data...");
    const data = await getSeriesData("Stranger Things");

    if (data && data.seasons[5]) {
        console.log("Season 5 Episodes:");
        data.seasons[5].forEach(ep => {
            console.log(`Ep ${ep.Episode}: Rating=${ep.imdbRating} (ID: ${ep.imdbID}) - Title: ${ep.Title}`);
        });
    } else {
        console.log("Season 5 not found or no data returned.");
    }
}

debugStrangerThings();
