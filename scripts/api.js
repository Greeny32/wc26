// SCRIPT TO CALL API AND STORE FIXTURES IN JSON FILE
const fs = require("fs");

console.log("KEY EXISTS:", !!process.env.FTBL_KEY);
console.log("KEY VALUE:", process.env.FTBL_KEY);

async function update() {
    const [standings, matches] = await Promise.all([
        get("/competitions/WC/standings"),
        get("/competitions/WC/matches")
    ]);

    const data = await response.json();

    const data = {
        standings,
        matches,
        updated: new Date().toISOString()
    };

    fs.writeFileSync(
        "data/fixtures.json",
        JSON.stringify(data, null, 2)
    );


}

update();
