const app = require('./app.js');

const lanes = require('./lanes.js');

class HUD {
  constructor() {
    this.zone = 2
    this.bases = [];
  }

  updateBase(facilityId, factionId) {
    for (var i in this.bases) {
      if (facilityId == this.bases[i].id) {
        this.bases[i].faction = factionId
		 
      }
    }
  }

  getBase(facilityId) {
    for (var i in this.bases) {
      if (facilityId == this.bases[i].id) {
        return this.bases[i]
      }
    }
    return undefined
  }

  reset() {
    this.zone = 2
    this.bases = [];
    this.refreshHud()
  }

  setBases(bases) {
    for (var i in bases) {
      var newInstance = new lanes.Base(bases[i].id, bases[i].type, bases[i].name, bases[i].home)
      this.bases.push(newInstance)
    }
  }

  setZone(zone_id) {
    this.zone = zone_id
  }

  getZone() {
    return this.zone
  }

  getBasesIDs() {
    return this.bases.map(base => base.id)
  }

  refreshHud() {
    app.send("refreshHud", {
      bases: this.bases.map(base => base.toJson())
    });
  }

}

module.exports = HUD;
