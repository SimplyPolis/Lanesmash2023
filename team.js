const app     = require('./app.js');

const Faction = require('./faction.js');

class Team {
  constructor(id) {
    this.id = id;
    this.name = "";
    this.faction = Faction.NS;
    this.score = 0
  }

  toJson() {
    return {
      id:this.id,
      name:this.name,
      faction:Faction.name(this.faction),
      score:this.score
    }
  }
}

let t1 = new Team(1)

let t2 = new Team(2)

function getT1() { return t1; }

function getT2() { return t2; }

function resetScore() {
  t1.score = 0
  t2.score = 0
  teamsUpdate();
}

function setProperty(teamId, property, value) {
  if (teamId == 1) {
    t1[property] = value
  } else {
    t2[property] = value
  }
}

function teamsUpdate() {
    app.send('teamsUpdate', { teamOne: t1.toJson(), teamTwo: t2.toJson() });
}

function getTeamFromFaction(factionId) {
  if (factionId ==  t1.faction) {return t1}
  if (factionId ==  t2.faction) {return t2}
  return undefined
}

function addScore(teamId) {
  if (teamId == 1) {
    setProperty(teamId, "score", t1.score + 1)
  } else {
    setProperty(teamId, "score", t2.score + 1)
  }
  teamsUpdate();
}

function reduceScore(teamId) {
  if (teamId == 1) {
    setProperty(teamId, "score", t1.score - 1)
  } else {
    setProperty(teamId, "score", t2.score - 1)
  }
  teamsUpdate();
}

exports.getT1       = getT1;
exports.getT2       = getT2;
exports.resetScore  = resetScore;
exports.setProperty = setProperty
exports.getTeamFromFaction = getTeamFromFaction
exports.teamsUpdate =  teamsUpdate
exports.addScore = addScore
exports.reduceScore = reduceScore
