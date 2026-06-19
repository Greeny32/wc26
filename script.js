const date = new Date();
date.setDate(date.getDate());
const btn_left = document.getElementById("dayBack");
const btn_right = document.getElementById("dayFwd");
const txt_date = document.getElementById("date");

btn_left.addEventListener("click", date_left);
btn_right.addEventListener("click", date_right);


function date_left() {
    document.querySelector("main").innerHTML = '<center><div id="container", class="container"></div></center>';
    date.setDate(date.getDate() - 1);
    main();
}

function date_right() {
    document.querySelector("main").innerHTML = '<center><div id="container", class="container"></div></center>';
    date.setDate(date.getDate() + 1);
    main();
}

function getFlag(country) {
    const src = "/flags/"
    return src + country + ".jpg";
}

// UPDATE DATE
function updateDate() {
    const txtmonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let day = date.getDate();
    let month = txtmonths[date.getMonth()];
    let yr = date.getFullYear();
    txt_date.innerHTML = day + ", " + month + " " + yr;
}

// LOAD FIXTURES FROM JSON
async function load() {
    const response = await fetch("data/fixtures.json");
    const data = await response.json();

    const matches = data.matches;

    // Start of "today" at 07:00 UTC
    const start = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        7, 0, 0
    ));

    // If current time is before 07:00, shift start back one day
    if (date < start) {
        start.setUTCDate(start.getUTCDate() - 1);
    }

    // End is 24h later (next day 07:00)
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    todayMatches = matches.filter(match => {
        const matchTime = new Date(match.utcDate);
        return matchTime >= start && matchTime < end;
    });

    return todayMatches;

}

function load_display(todayMatches) {
    // PUT FIXTURES IN DOCUMENT
    const container = document.getElementById("container");
    const numItems = 4
    for (let i = 0; i < numItems; i++) {
        // Get fixtures
        let match = todayMatches[i];
        let ht = match.homeTeam.shortName;
        let at = match.awayTeam.shortName;
        let status = match.status;
        var ko_time = new Date(match.utcDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
        let g = match.group
        let group = g.slice(-1);

        // If finished display score otherwise time
        if (status == "FINISHED") {
            var scr_ht = match.score.fullTime.home;
            var scr_at = match.score.fullTime.away;
            var score = scr_ht + " - " + scr_at;
        }
        else {
            var score = ko_time;
        }

        // load images
        // load images
        var ht_img = document.createElement("img");
        ht_img.src = getFlag(ht);

        var at_img = document.createElement("img");
        at_img.src = getFlag(at);

        // text elements (must be nodes)
        const text = document.createElement("span");
        text.textContent = `${ht} ${score} ${at}`;

        const groupText = document.createElement("p");
        groupText.textContent = "Group " + String(group);

        // container div
        const div = document.createElement("div");
        div.classList.add("match");

        // append in order
        div.appendChild(ht_img);
        div.appendChild(text);
        div.appendChild(at_img);
        div.appendChild(groupText);

        container.appendChild(div);

        // classes (fine here too)
        ht_img.classList.add("flag");
        at_img.classList.add("flag");

    }
}

async function main() {
    updateDate();
    const todayMatches = await load();
    await load_display(todayMatches);
}

main();