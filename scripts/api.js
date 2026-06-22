// SCRIPT TO CALL API AND STORE FIXTURES IN JSON FILE
const fs = require("fs");

console.log("KEY EXISTS:", !!process.env.FTBL_KEY);
console.log("KEY VALUE:", process.env.FTBL_KEY);

async function update(){
    const headers = {
        "X-Auth-Token": process.env.FTBL_KEY
    };

    // Fetch standings + matches in parallel
    const [standingsRes, matchesRes] = await Promise.all([
        fetch("https://api.football-data.org/v4/competitions/WC/standings", { headers }),
        fetch("https://api.football-data.org/v4/competitions/WC/matches", { headers })
    ]);

    const standings = await standingsRes.json();
    const matches = await matchesRes.json();

    const data = {
        standings,
        matches
    };

    fs.writeFileSync(
        "data/fixtures.json",
        JSON.stringify(data, null, 2)
    );
}

update();
