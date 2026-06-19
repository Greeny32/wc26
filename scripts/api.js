// SCRIPT TO CALL API AND STORE FIXTURES IN JSON FILE
const fs = require("fs");

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