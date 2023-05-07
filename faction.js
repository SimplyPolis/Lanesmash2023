const Faction = {
    NC: 2,
    VS: 1,
    TR: 3,
    NS: 4,
    name: function(id){
        switch(id){
            case Faction.NC: return 'NC';
            case Faction.VS: return 'VS';
            case Faction.TR: return 'TR';
            case Faction.NS: return 'NS';
            default: return 'NULL';
        }
    }
}

module.exports = Faction;
