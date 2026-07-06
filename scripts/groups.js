
async function load(){
    const response = await fetch("data/fixtures.json");
    const data = await response.json();
    standings = data.standings.standings;
    return standings;
}

async function display_group(standings){
    const container = document.getElementById("container");
    const div = document.createElement("div");
    div.classList.add("box");

    // for each group
    for (let i=0; i < 12; i++){

        const group_box = document.createElement("div");
        group_box.classList.add("group_box")

        const group = standings[i];
        var txt_group = document.createElement("p");
        txt_group.textContent = group.group;
        txt_group.classList.add("group_name");
        group_box.appendChild(txt_group);
        
        // for each team
        for (let j=0; j < 4; j++){
            
            // display team name
            const team = group.table[j];
            var txt_team = document.createElement("p");
            txt_team.textContent = (j+1)+": "+team.team.name+" ("+team.playedGames+")"+", "+team.points+"pts";
            group_box.append(txt_team);

        }

        div.append(group_box)
    }

    container.append(div);
}

async function main(){
    var standings = await load();
    display_group(standings);
}

main();