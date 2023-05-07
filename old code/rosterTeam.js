console.log(TEAM)


var socket = io();
socket.emit('subscribe');

team = undefined
players = undefined

function initDisplay(){
  $("h1").html(team)


  $("tbody").empty()
  for (var i = 0; i < players.length; i++) {
    var tr = $("<tr>");
    tdName = $("<td>");
    if (players[i].outfitAlias != undefined || players[i].outfitAlias != "") {
      tdName.html("["+ players[i].outfitAlias + "] " + players[i].name)
    } else {
      tdName.html(players[i].name)
    }
    tdClass = $("<td>");
    if (players[i].mostPlayedClassId == 6) { //HA
      tdClass.html('<img src="PNG/ha.png" height="22">')
    } else if (players[i].mostPlayedClassId == 4) { //Medic
      tdClass.html('<img src="PNG/medic.png" height="22">')
    } else if (players[i].mostPlayedClassId == 5) { //Engi
      tdClass.html('<img src="PNG/engi.png" height="22">')
    } else if (players[i].mostPlayedClassId == 3) { //LA
      tdClass.html('<img src="PNG/la.png" height="22">')
    } else if (players[i].mostPlayedClassId == 1) { //Infil
      tdClass.html('<img src="PNG/infil.png" height="22">')
    } else { //MAX
      tdClass.html('<img src="PNG/max.png" height="22">')
    }

    tdKDR = $("<td>");
    tdKDR.html(players[i].killDeathRatio.toFixed(2))
    tdHSR = $("<td>");
    tdHSR.html((players[i].headshotRatio * 100).toFixed(2) + "%")
    tdIvI = $("<td>");
    tdIvI.html(players[i].iviScore)
    tdWeapon = $("<td>");
    tdWeapon.html(players[i].mostPlayedWeaponName)

    tr.append(tdName);
    tr.append(tdKDR);
    tr.append(tdHSR);
    tr.append(tdIvI);
    tr.append(tdClass);
    tr.append(tdWeapon);
    $("tbody").append(tr)
  }
}

socket.on('broadcast',function(data) {
  console.log(data)
  if (data.team1 != undefined && data.team2 != undefined) {
    if (TEAM == 1) {
      team = data.team1
      players = data.rosterTeam1
    } else {
      team = data.team2
      players = data.rosterTeam2
    }
    initDisplay()
  }
});
