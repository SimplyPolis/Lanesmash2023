const express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var events = require('events');
var path = require('path');
var bodyParser = require("body-parser");
var engines = require('consolidate');

localPath = "./"

team1 = undefined
team2 = undefined
factionTeam1 = undefined
factionTeam2 = undefined
scoreTeam1 = 0
scoreTeam2 = 0
lane = 1
round = 1
start = false
pause = undefined
timer = undefined
rosterTeam1 = undefined
rosterTeam2 = undefined
shouldDisplayLaneHUD = true

app.use(express.static(localPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/public/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/admin', function(req, res){
  var filePath = localPath+"admin.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

app.get('/', function(req, res){
  var filePath = localPath+"overlay.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

app.get('/versus', function(req, res){
  var filePath = localPath+"versus.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

app.get('/roster-team1', function(req, res){
  var filePath = localPath+"rosterTeam1.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

app.get('/roster-team2', function(req, res){
  var filePath = localPath+"rosterTeam2.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  socket.on('subscribe', function() {
      io.sockets.emit('broadcast', {
        team1: team1,
        team2: team2,
        factionTeam1: factionTeam1,
        factionTeam2: factionTeam2,
        rosterTeam1: rosterTeam1,
        rosterTeam2: rosterTeam2,
        lane: lane,
        round:round,
        scoreTeam1:scoreTeam1,
        scoreTeam2:scoreTeam2,
        timer:timer,
        start:start,
        pause:pause,
        shouldDisplayLaneHUD:shouldDisplayLaneHUD,
      });
  });

  socket.on('updateTeam', function(data){
    if (start == false) {
      team1 = data.team1
      team2 = data.team2
      factionTeam1 = data.factionTeam1,
      factionTeam2 = data.factionTeam2,
      io.sockets.emit('broadcast', {
        team1: team1,
        team2: team2,
        factionTeam1: factionTeam1,
        factionTeam2: factionTeam2,
      });
    }
  });

  socket.on("timer", function(data) {
    timer = data.timer
  })

  socket.on("toogleLaneHUD", function(data) {
     shouldDisplayLaneHUD = data.value
     io.sockets.emit('broadcast', {
       shouldDisplayLaneHUD:shouldDisplayLaneHUD
     })
  })

  socket.on('updateScore', function(data){
    if (start == true || data.admin == true) {
      scoreTeam1 = data.scoreTeam1
      scoreTeam2 = data.scoreTeam2
      io.sockets.emit('broadcast', {
        scoreTeam1:scoreTeam1,
        scoreTeam2:scoreTeam2,
      });
    }
  });

  socket.on('teamRoster', function(data){
    if (start != true) {
      if (data.team == 1) {
        rosterTeam1 = data.players
      } else {
        rosterTeam2 = data.players
      }
    }
  });

  socket.on('updateLane', function(data){
    if (start == false) {
      lane = data.lane
      io.sockets.emit('broadcast', {
        lane: lane,
      });
    }
  });

  socket.on('start', function(data){
    if (start == false) {
      pause = false
      start = true
      io.sockets.emit('broadcast', {
        round:round,
        start:start,
        pause:pause
      });
      round = round + 1
    }
  });

  socket.on('pause', function(data){
    pause = true
    io.sockets.emit('broadcast', {
      pause:pause,
    });
  });

  socket.on('resume', function(data){
    pause = false
    io.sockets.emit('broadcast', {
      pause:pause,
    });
  });

  socket.on('restart', function(data){
    round = 1
    pause = true
    start = false
    scoreTeam1 = 0
    scoreTeam2 = 0
    io.sockets.emit('broadcast', {
      round:round,
      pause:pause,
      start:start,
      scoreTeam1:scoreTeam1,
      scoreTeam2:scoreTeam2
    });
  });

  socket.on('endRound', function(data){
    pause = true
    start = false
    io.sockets.emit('broadcast', {
      round:round,
      pause:pause,
      start:start,
    });
  });
});
