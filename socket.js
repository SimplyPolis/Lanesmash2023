const app = require('./app.js'),
      team = require('./team.js'),
      match = require('./match.js');


module.exports = {
    init: function(io) {
      io.on('connection', function(socket){
        socket.on('subscribe', function(data) {
          if (data && data.admin) {
            send("broadcast", match.getAllInfo())
          } else {
            match.refresh()
            team.teamsUpdate()
          }
        });
        socket.on('initializeMatch', function(data) {
          match.setLane(data.lane)
          match.setCaster1(data.caster1)
          match.setCaster2(data.caster2)
          match.setFactionUsed(data.factionTeam1, data.factionTeam2)
          team.setProperty(1, "name",  data.team1)
          team.setProperty(2, "name",  data.team2)
          team.setProperty(1, "faction",  data.factionTeam1)
          team.setProperty(2, "faction",  data.factionTeam2)
          match.initializeMatch()
        });
        socket.on('Start', function() {
          match.start()
        });
        socket.on('Reset', function() {
          match.reset()
        });
        socket.on('addScore', function(data) {
          match.addScoreToTeam(data.teamId)
        });
        socket.on('subScore', function(data) {
          match.removeScoreFromTeam(data.teamId)
        });
      });
      function send(name, obj) {
          io.emit(name, obj);
      };
    },
    sendData : function (name, obj, io) {
      io.emit(name, obj);
    },
};
