var date = new Date();
date.setDate(date.getDate());
const btn_left = document.getElementById("dayBack");
const btn_right = document.getElementById("dayFwd");
const btn_date = document.getElementById("date");
const txt_refresh = document.getElementById("refresh");
const btn_groups = document.getElementById("groups");


btn_left.addEventListener("click", date_left);
btn_right.addEventListener("click", date_right);
btn_date.addEventListener("click", reset_date);

function reset_date() {

    document.querySelector("main").innerHTML = '<center><div id="container", class="container"></div></center>';
    date = new Date();
    main();
}

function date_left() {
    date.setDate(date.getDate() - 1);
    document.querySelector("main").innerHTML = '<center><div id="container", class="container"></div></center>';
    main();
}

function date_right() {
    document.querySelector("main").innerHTML = '<center><div id="container", class="container"></div></center>';
    date.setDate(date.getDate() + 1);
    main();
}

function getFlag(country) {
    const src = "./flags/"
    return src + country + ".jpg";
}

// UPDATE DATE
function updateDate() {
    const txtmonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let day = date.getDate();
    let month = txtmonths[date.getMonth()];
    let yr = date.getFullYear();
    btn_date.innerHTML = day + ", " + month + " " + yr;
}

// LOAD FIXTURES FROM JSON
async function load() {
    const response = await fetch("data/fixtures.json");
    const data = await response.json();

    const matches = data.matches.matches;

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
    for (const match of todayMatches) {
        // Get fixtures
        let ht = match.homeTeam.shortName;
        let at = match.awayTeam.shortName;

        // check if team is null
        if (ht == null) {
            ht = "None";
        }
        if (at == null) {
            at = "None";
        }

        let status = match.status;
        var ko_time = new Date(match.utcDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });


        var txt_score = document.createElement("p");
        // If finished display score otherwise time
        if (status == "FINISHED") {
            console.log(match.score.duration);
            if (match.score.duration == "PENALTY_SHOOTOUT") {
                let home_ft = match.score.regularTime.home;
                let away_ft = match.score.regularTime.away;
                let home_et = match.score.extraTime.home;
                let away_et = match.score.regularTime.away;
                let home_pen = match.score.penalties.home;
                let away_pen = match.score.penalties.away;
                
                // remove the added score
                if (home_pen > away_pen){
                    home_ft -= 1;
                }
                else {
                    away_ft -= 1;
                }

                var scr_ht = (home_ft+home_et) + " ("+home_pen+")";
                var scr_at = "("+away_pen+") "+(away_ft+away_et);
            } else {
                var scr_ht = match.score.fullTime.home;
                var scr_at = match.score.fullTime.away;
            }

            var score = scr_ht + " - " + scr_at;
            txt_score.classList.add("result");
        }
        else {
            var score = ko_time;
        }

        var groupText = document.createElement("p");

        if (match.stage == "GROUP_STAGE") {
            let g = match.group
            var group = g.slice(-1);
            groupText.textContent = "Group " + String(group);

        } else {
            // create a lookup table to format output
            const labels = {
                LAST_32: "Round of 32",
                LAST_16: "Round of 16",
                QUARTER_FINALS: "Quarter Final",
                SEMI_FINALS: "Semi Final",
                THIRD_PLACE: "Third Place Playoff",
                FINAL: "Final"
            }

            groupText.textContent = labels[match.stage] || match.stage;
        }

        // load images
        var ht_img = document.createElement("img");
        ht_img.src = getFlag(ht);
        var at_img = document.createElement("img");
        at_img.src = getFlag(at);

        var txt_ht = document.createElement("p");
        txt_ht.textContent = ht;
        var txt_at = document.createElement("p");
        txt_at.textContent = at;

        txt_score.textContent = score;


        // container div
        const div = document.createElement("div");
        div.classList.add("match");

        // append in order
        div.appendChild(ht_img);
        div.appendChild(txt_ht);
        div.appendChild(txt_score);
        div.appendChild(txt_at);
        div.appendChild(at_img);
        div.appendChild(groupText);

        container.appendChild(div);

        // classes (fine here too)
        ht_img.classList.add("flag");
        at_img.classList.add("flag");

    }
}

async function refresh() {
    const res = await fetch("last-run.txt");
    const time = await res.text();

    const refresh_time = new Date(time.trim());

    const formatter = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    txt_refresh.textContent = "Refreshed: " + formatter.format(refresh_time);

    // Restart animation

}

async function main() {
    // remove refresh text
    txt_refresh.classList.remove("refresh_in");
    txt_refresh.classList.add("refresh_remove");
    btn_groups.classList.remove("refresh_in");
    btn_groups.classList.add("refresh_remove");

    updateDate();
    refresh();
    const todayMatches = await load();
    await load_display(todayMatches);

    // add refresh text
    txt_refresh.classList.remove("refresh_remove");
    btn_groups.classList.remove("refresh_remove");
    void txt_refresh.offsetWidth; // restart animation reliably
    txt_refresh.classList.add("refresh_in");
    btn_groups.classList.add("refresh_in");
}



main();