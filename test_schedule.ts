import axios from "axios";

async function testSchedule() {
    try {
        console.log("Testing TVMaze Schedule (US)...");
        const usRes = await axios.get("https://api.tvmaze.com/schedule?country=US");
        console.log(`US Schedule Status: ${usRes.status}, Items: ${usRes.data.length}`);
        if (usRes.data.length > 0) console.log("Sample US:", usRes.data[0].show.name);

        console.log("Testing TVMaze Schedule (India)...");
        const inRes = await axios.get("https://api.tvmaze.com/schedule?country=IN");
        console.log(`India Schedule Status: ${inRes.status}, Items: ${inRes.data.length}`);
        if (inRes.data.length > 0) console.log("Sample IN:", inRes.data[0].show.name);

    } catch (e) {
        console.error("Error:", e);
    }
}

testSchedule();
