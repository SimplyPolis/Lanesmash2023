const Faction = require('./faction.js');
const match = require('./match.js');
const lanesjson=require('./lanes.json');

class Base {
  constructor(id, type, name, home) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.home = home;
    this.faction = Faction.NS
  }

  toJson() {
    return {
      id:this.id,
      type:this.type,
      name:this.name,
      home:this.home,
      faction:match.isFactionUsed(this.faction) ? Faction.name(this.faction) : Faction.name(Faction.NS)
    }
  }
}
function getLanes(){
	for (let lane in lanesjson){
    		for (let bases in lanesjson[lane]["bases"]){
       		 lanesjson[lane]["bases"][bases]=new Base(lanesjson[lane]["bases"][bases]["id"],lanesjson[lane]["bases"][bases]["type"],lanesjson[lane]["bases"][bases]["name"],lanesjson[lane]["bases"][bases]["home"]);
		}
	}
	return(lanesjson);
}
let lanes = getLanes()
	


function getLane(id) {
    return lanes[id];
}
function getLaneIDs(id) {
    	baseids=[];
	for (let base in lanes[id]["bases"]){
		baseids.push((lanes[id]["bases"][base]["id"]).toString());
	}
	return baseids;

}
function toJson(lane) {
  return {
      id:lane.id,
      min:lane.min,
      zone:lane.zone,
      bases:lane.bases.map(base => base.toJson())
  }
}

exports.Base = Base;
exports.getLane = getLane;
exports.toJson = toJson;
exports.getLaneIDs = getLaneIDs;
