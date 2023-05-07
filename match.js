const app = require('./app.js'),
Timer = require('./timer.js'),
Faction = require('./faction.js'),
team = require('./team.js'),
HUD = require('./hud.js'),
otws = require('./otws.js'),
lanes = require('./lanes.js');
const axios = require('axios');
var serviceid=require('./serviceid.json');
serviceid=serviceid["serviceid"]


let caster1 = ""
let caster2 = ""

let lane_id = 0

let round = 0

let server_id = 19

let hasBeenInit = false
let hasStart = false

const timer = new Timer()

const hud = new HUD()

let factionUsed = []

function getAllInfo() {
    return {
      lane:lane_id,
      caster1:caster1,
      caster2:caster2,
      team1:team.getT1().toJson(),
      team2:team.getT2().toJson(),
      hud:hud.bases.map(base => base.toJson()),
      hasBeenInit:hasBeenInit,
      hasStart:hasStart,
      round:round
    }
}

function getTimer() {
  return timer
}

function setLane(value) {
  lane_id = value;
  hud.setBases(lanes.getLane(lane_id)["bases"])
  timer.setMinutes(lanes.getLane(lane_id)["min"])
}

function getRound() {
  return round
}

function setCaster1(value) {
  caster1 = value
}

function setCaster2(value) {
  caster2 = value
}

function dealWithTheData(raw) {
  var data = JSON.parse(raw);
  data=data.payload;
  if(data){
  if (hasBeenInit == true && lanes.getLaneIDs(lane_id).includes(data.facility_id)) {
      if (data.new_faction_id != data.old_faction_id && hasStart==true) {
        if (team.getT1().faction == data.new_faction_id) {
          team.addScore(1)
        } else if (team.getT2().faction == data.new_faction_id) {
          team.addScore(2)
        }
	if (hud.getBase(Number(data.facility_id)).home == "true") {
          stop()
        }
      }
      hud.updateBase(Number(data.facility_id), Number(data.new_faction_id))
      hud.refreshHud()
    
  }
}
}
function initializeMatch() {
  hasBeenInit = true
  round = 1
  team.teamsUpdate()
  otws.setMatch()
 
let qster="https://census.daybreakgames.com/s:"
  qster=qster.concat(serviceid,"/get/ps2:v2/map/?world_id=",server_id,"&zone_ids=",lanes.getLane(lane_id)["zone"],"&c:join=type:map_region^list:0^inject_at:facility^on:Regions.Row.RowData.RegionId^to:map_region_id^show:facility_id")
  
axios.get(qster)
.then((res) => {
	initbases(res.data);
})
.catch((err) => {
	console.log(err)
})
   refresh()
}
function initbases(data){
	let lids=lanes.getLaneIDs(lane_id)
	for (let base in data["map_list"][0]["Regions"]["Row"]){
		let facilityId=data["map_list"][0]["Regions"]["Row"][base]["RowData"]["facility"]["facility_id"];
		let index=lids.indexOf(facilityId);
		if(index!=-1){
			hud.updateBase(Number(facilityId),  Number(data["map_list"][0]["Regions"]["Row"][base]["RowData"]["FactionId"]));
			hud.refreshHud();
			lids.splice(index,1);
		}
	}
}
  

function start() {
  if (hasStart == false) {
    hasStart = true
    timer.startTimer()
  }
}

function stop() {
  hasStart = false
  hasBeenInit = false
  timer.stopTimer()
}

function setTimer(minutes) {
  timer.setMinutes(minutes)
}

function matchEnded() {
  hasBeenInit = false
  hasStart = false
  refresh()
}

function setFactionUsed(fac1, fac2) {
  factionUsed = [fac1, fac2]
}

function getFactionUsed() {
  return factionUsed
}

function isFactionUsed(fac) {
  for (var i in factionUsed) {
    if (fac == factionUsed[i])
      return true
  }
  return false
}

function roundEnded() {
  hasBeenInit = true
  hasStart = false
  round += 1
  timer.resetTimer()
  timer.setMinutes(lanes.getLane(lane_id)["min"])
  refresh()
}

function reset() {
  hasStart = false
  hasBeenInit = false
  otws.resetMatch()
  hud.reset()
  team.resetScore()
  timer.resetTimer()
  round = 1
  factionUsed = []
  caster1 = ""
  caster2 = ""
  lane_id = 0
  refresh()
}

function getTime() {
  time = timer.getTime()
  return time
}

function getHud() {
  return hud
}

function refresh() {
  app.send('refresh', getAllInfo());
  timer.sendTimerInfo()
}

function addScoreToTeam(teamId) {
  team.addScore(teamId)
}
function removeScoreFromTeam(teamId) {
  team.reduceScore(teamId)
}
exports.dealWithTheData = dealWithTheData;
exports.start = start;
exports.stop = stop;
exports.reset = reset;
exports.addScoreToTeam = addScoreToTeam;
exports.removeScoreFromTeam = removeScoreFromTeam;
exports.refresh = refresh;
exports.setLane = setLane;
exports.setCaster1 = setCaster1;
exports.setCaster2 = setCaster2;
exports.initializeMatch = initializeMatch;
exports.matchEnded = matchEnded;
exports.roundEnded = roundEnded;
exports.getTime = getTime;
exports.getAllInfo = getAllInfo;
exports.setTimer = setTimer;
exports.getHud = getHud;
exports.getRound = getRound;
exports.setFactionUsed = setFactionUsed;
exports.getFactionUsed = getFactionUsed;
exports.isFactionUsed = isFactionUsed;
