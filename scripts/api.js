// SCRIPT TO CALL API AND STORE FIXTURES IN JSON FILE
const fs = require("fs");

console.log("KEY EXISTS:", !!process.env.FTBL_KEY);
console.log("KEY VALUE:", process.env.FTBL_KEY);

async function update(){
    // Call api
    const response = await fetch(
        "https://api.football-data.org/v4/competitions/WC/matches",
        {
            headers: {
                "X-Auth-Token": process.env.FTBL_KEY
            }
        }
    );
    const data = await response.json();

    fs.writeFileSync(
        "data/fixtures.json",
        JSON.stringify(data, null, 2)
    );
}

update();

const date = new Date();

fs.writeFileSync("data/refresh.txt", String(date));