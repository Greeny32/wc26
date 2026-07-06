const btn_32 = document.getElementById("r32");
const btn_16 = document.getElementById("r16");
const btn_qf = document.getElementById("qf");
const btn_sf = document.getElementById("sf");
const btn_f = document.getElementById("f");
const btn_groups = document.getElementById("groups")
const btn_schedule = document.getElementById("schedule")


btn_32.addEventListener("click", () => update_round("LAST_32"));
btn_16.addEventListener("click", () => update_round("LAST_16"));
btn_qf.addEventListener("click", () => update_round("QUARTER_FINALS"));
btn_sf.addEventListener("click", () => update_round("SEMI_FINALS"));
btn_f.addEventListener("click", () => update_round("FINAL"));


var round = "LAST_32";

function update_round(rnd) {
    document.querySelector("main").innerHTML = '<center><div id="container", class="container"></div></center>';
    round = rnd;
    main();
}


// load all standings
async function load() {
    const response = await fetch("data/fixtures.json");
    const data = await response.json();

    const knockout_fixtures = data.matches.matches.filter(match =>
        match.stage !== "GROUP_STAGE"
    );

    return knockout_fixtures;
}

function getRound(stage, fixtures) {
    // LAST_32, LAST_16, QUARTER_FINALS, SEMI_FINALS, FINAL
    return fixtures.filter(match => match.stage === stage);
}

function getFlag(country) {
    const src = "./flags/"
    return src + country + ".jpg";
}

function load_display(fixtures) {

    const container = document.getElementById("container");

    for (var match of fixtures) {
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

        var date = new Date(match.utcDate).toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        var txt_date = document.createElement("p");
        txt_date.textContent = date;

        var txt_score = document.createElement("p");
        // If finished display score otherwise time
        if (status == "FINISHED") {
            if (match.score.duration == "PENALTY_SHOOTOUT") {
                let home_ft = match.score.regularTime.home;
                let away_ft = match.score.regularTime.away;
                let home_et = match.score.extraTime.home;
                let away_et = match.score.regularTime.away;
                let home_pen = match.score.penalties.home;
                let away_pen = match.score.penalties.away;

                // remove the added score
                if (home_pen > away_pen) {
                    home_ft -= 1;
                }
                else {
                    away_ft -= 1;
                }

                var scr_ht = (home_ft + home_et) + " (" + home_pen + ")";
                var scr_at = "(" + away_pen + ") " + (away_ft + away_et);
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
        div.appendChild(txt_date);

        container.appendChild(div);

        // classes (fine here too)
        ht_img.classList.add("flag");
        at_img.classList.add("flag");
    }

}

async function main() {
    btn_schedule.classList.remove("refresh_in");
    btn_schedule.classList.add("refresh_remove");
    btn_groups.classList.remove("refresh_in");
    btn_groups.classList.add("refresh_remove");

    const fixtures = await load();

    // load display
    load_display(getRound(round, fixtures));

    btn_schedule.classList.remove("refresh_remove");
    btn_groups.classList.remove("refresh_remove");
    void btn_schedule.offsetWidth;
    btn_schedule.classList.add("refresh_in");
    btn_groups.classList.add("refresh_in");
}

main();

