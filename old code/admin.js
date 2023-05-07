var socket = io();
socket.emit('subscribe');

scoreTeam1 = 0
scoreTeam2 = 0

$(function(){

  $("#btnLane").on('click', function(){
    lane = $("#selectLane").val()
    socket.emit('updateLane', {
      lane : lane,
    });
  })

  $( "#teamForm" ).submit(function( event ) {
    team1 = $("#team1").val()
    team2 = $("#team2").val()
    factionTeam1 = $("#selectFactionTeam1").val()
    factionTeam2 = $("#selectFactionTeam2").val()
    $("#btnTeam1Cap").text(team1 + " Cap a base")
    $("#btnTeam2Cap").text(team2 + " Cap a base")
    if (team1 != "" && team2 != "") {
      socket.emit('updateTeam', {
        team1 : team1,
        team2 : team2,
        factionTeam1 : factionTeam1,
        factionTeam2 : factionTeam2
      });
    }
    event.preventDefault();
  });

  $("#btnStart").on('click', function(){
    socket.emit('start');
  })

  $("#btnPause").on('click', function(){
    $("#btnPause").addClass("d-none");
    $("#btnResume").removeClass("d-none");
      socket.emit('pause');
  })

  $("#btnResume").on('click', function(){
    $("#btnResume").addClass("d-none");
    $("#btnPause").removeClass("d-none");
      socket.emit('resume');
  })

  function sendScore() {
    socket.emit('updateScore', {
      scoreTeam1 : scoreTeam1,
      scoreTeam2 : scoreTeam2,
      admin:true,
    })
  }

  $("#minusScoreTeam1").on('click', function(){
    scoreTeam1--
    sendScore()
  })
  $("#plusScoreTeam1").on('click', function(){
    scoreTeam1++
    sendScore()
  })
  $("#minusScoreTeam2").on('click', function(){
    scoreTeam2--
    sendScore()
  })
  $("#plusScoreTeam2").on('click', function(){
    scoreTeam2++
    sendScore()
  })

  $("#btnEndRound").on('click', function(){
      socket.emit('endRound');
  })

  $("#btnReStart").on('click', function(){
      $("#btnPauseResume").addClass("d-none");
      socket.emit('restart');
  })

  $('#toggle').change(function() {
    socket.emit('toogleLaneHUD', {
      value:$(this).prop('checked')
    })
  })

  socket.on('broadcast',function(data) {
    if (data.start != undefined) {
      if (data.start == true) {
        $("#btnPauseResume").removeClass("d-none");
        $("#btnPause").removeClass("d-none");
        $("#btnResume").addClass("d-none");
        $("#btnEndRound").removeClass("d-none");
      } else if (data.start == false) {
        $("#btnEndRound").addClass("d-none");
        $("#btnPauseResume").addClass("d-none");
      }
    }
    if (data.scoreTeam1 != undefined && data.scoreTeam2 != undefined) {
        scoreTeam1 = data.scoreTeam1
        scoreTeam2 = data.scoreTeam2
        $("#scoreTeam1").text("score : " + scoreTeam1)
        $("#scoreTeam2").text("score : " + scoreTeam2)
    }
    if (data.shouldDisplayLaneHUD == true && $('#toggle').prop('checked') == true) {
      $('#toggle').bootstrapToggle('on')
    } else if (data.shouldDisplayLaneHUD == false && $('#toggle').prop('checked') == true) {
      $('#toggle').bootstrapToggle('off')
    }
  });

  function onRead(event, team) {
    var jsonObj = JSON.parse(event.target.result);
    socket.emit("teamRoster", {
      team : team,
      players : jsonObj
    });
  }

  $(document).on('change', '#jsonFileTeam1', function(event) {
    var reader = new FileReader();
    reader.onload = function(event) {
      $("#RosterTeam1").addClass("success")
      $("#jsonFileTeam1Label").text("Team 1 loaded")
      onRead(event, 1)
    }
    reader.readAsText(event.target.files[0]);
  });

  $(document).on('change', '#jsonFileTeam2', function(event) {
    var reader = new FileReader();
    reader.onload = function(event) {
      $("#RosterTeam2").addClass("success")
      $("#jsonFileTeam2Label").text("Team 2 loaded")
      onRead(event, 2)
    }
    reader.readAsText(event.target.files[0]);
  });



});
