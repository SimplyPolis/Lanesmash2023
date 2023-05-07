let WORLD_ID = 19

let NONE_ID = 0
let VS_ID = 1
let NC_ID = 2
let TR_ID = 3
let NSO_ID = 4

let LANE_TIMER_MIN = 30 // in minutes
let LANE_TIMER = LANE_TIMER_MIN * 60 * 1000

var socket = io();

var CountDown = (function ($) {
    // Length ms
    var TimeOut = 10000;
    // Interval ms
    var TimeGap = 1000;

    var CurrentTime = ( new Date() ).getTime();
    var EndTime = ( new Date() ).getTime() + TimeOut;

    var GuiTimer = $('h1');

    var Running = true;

    var TimeoutValue = undefined

    var UpdateTimer = function() {
        // Run till timeout
        var now  =  ( new Date() ).getTime();

        if( now < EndTime ) {
            TimeoutValue = setTimeout( UpdateTimer, TimeGap );
        } else {
            console.log("End of round");
            socket.emit('endRound');
            CountDown.Restart(LANE_TIMER);
        }
        // Countdown if running
        if( Running ) {
            CurrentTime = now
        }
        // Update Gui
        var Time = new Date();
        Time.setTime( EndTime - CurrentTime );
        var Minutes = Time.getMinutes();
        var Seconds = Time.getSeconds();

        socket.emit('timer', {
          timer : Time.getTime()
        });

        GuiTimer.html(
            (Minutes < 10 ? '0' : '') + Minutes
            + ':'
            + (Seconds < 10 ? '0' : '') + Seconds );
    };

    var Pause = function() {
        Running = false;
    };

    var Resume = function() {
        var now = ( new Date() ).getTime();
        var offSet = now - CurrentTime
        CurrentTime = now
        EndTime += offSet
        Running = true;
    };

    var IsRunning = function() {
        return Running;
    };

    var Restart = function( Timeout ) {
      TimeOut = Timeout;
      CurrentTime = ( new Date() ).getTime();
      socket.emit('timer', {
        timer : Timeout
      });
      EndTime = ( new Date() ).getTime() + TimeOut;
      Running = false;
      GuiTimer.html("" + LANE_TIMER_MIN + ":00");
      if (TimeoutValue != undefined) {
        clearTimeout(TimeoutValue)
      }
    };

    var Start = function( Timeout ) {
        if (TimeoutValue != undefined) {
          clearTimeout(TimeoutValue)
        }
        socket.emit('timer', {
          timer : Timeout
        });
        TimeOut = Timeout;
        CurrentTime = ( new Date() ).getTime();
        EndTime = ( new Date() ).getTime() + TimeOut;
        UpdateTimer();
    };

    return {
        Pause: Pause,
        Resume: Resume,
        Start: Start,
        Restart: Restart,
        IsRunning: IsRunning,
    };
})(jQuery);

class Base {
  constructor(id, faction) {
    this.id = id;
    this.faction = faction;
  }
}

class Team {
  constructor(name, faction) {
    this.name = name;
    this.faction = faction
  }
}

const Side = {
    RIGHT: true,
    LEFT: false,
}

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}

var params = getSearchParameters();

$(function(){
  var lane1 = [
    new Base(206000, NONE_ID),
    new Base(206002, NONE_ID),
    new Base(222180, NONE_ID),
    new Base(211001, NONE_ID),
    new Base(211000, NONE_ID)
  ]
  var lane2 = [
    new Base(204000, NONE_ID),
    new Base(204003, NONE_ID),
    new Base(222080, NONE_ID),
    new Base(222330, NONE_ID),
    new Base(222340, NONE_ID),
    new Base(210001, NONE_ID),
    new Base(210000, NONE_ID)
  ]
  var lane3 = [
    new Base(216000, NONE_ID),
    new Base(222120, NONE_ID),
    new Base(260004, NONE_ID),
    new Base(222130, NONE_ID),
    new Base(215000, NONE_ID)
  ]
  var lane4 = [
    new Base(256000, NONE_ID),
    new Base(256020, NONE_ID),
    new Base(242000, NONE_ID),
    new Base(244000, NONE_ID),
    new Base(257020, NONE_ID),
    new Base(257000, NONE_ID)
  ]
  var lane5 = [
    new Base(253000, NONE_ID),
    new Base(253020, NONE_ID),
    new Base(233000, NONE_ID),
    new Base(255030, NONE_ID),
    new Base(255000, NONE_ID)
  ]
  var lane6 = [
    new Base(304000, NONE_ID),
    new Base(304030, NONE_ID),
    new Base(282000, NONE_ID),
    new Base(283000, NONE_ID),
    new Base(306020, NONE_ID),
    new Base(306000, NONE_ID)
  ]
  var lane7 = [
    new Base(305000, NONE_ID),
    new Base(305010, NONE_ID),
    new Base(277000, NONE_ID),
    new Base(278000, NONE_ID),
    new Base(303010, NONE_ID),
    new Base(303000, NONE_ID)
  ]
  var lane8 = [
    new Base(304000, NONE_ID),
    new Base(304030, NONE_ID),
    new Base(282000, NONE_ID),
    new Base(287060, NONE_ID),
    new Base(293000, NONE_ID)
  ]

  var LANES = [
    lane1,
    lane2,
    lane3,
    lane4,
    lane5,
    lane6,
    lane7,
    lane8
  ]

  var lane_index = undefined
  var lane = undefined

  var team1 = undefined
  var team2 = undefined

  var scoreTeam1 = 0
  var scoreTeam2 = 0

  var outfitUrl = "https://www.outfit-tracker.com/services/outfits/resolve"

  var LANE = undefined

  $("div.lane").addClass("d-none")
  $("h1").html("" + LANE_TIMER_MIN + ":00");


  socket.emit('subscribe');
  socket.on('broadcast',function(data) {
    if (data.team1 != undefined && data.team2 != undefined) {
      team1 = data.team1
      team2 = data.team2
      factionTeam1 = data.factionTeam1
      factionTeam2 = data.factionTeam2
      team1 = new Team(team1, factionTeam1)
      team2 = new Team(team2, factionTeam2)
      initTeam1();
      initTeam2();
      if (lane_index != undefined) {
        initDisplayLane(lane_index)
      }
    }
    if (data.lane != undefined) {
      old_lane = lane
      lane = parseInt(data.lane)
      lane_index = lane - 1
      if (LANE != undefined && old_lane != lane) {
        unSub()
      }

      LANE = LANES[lane_index]
      if (LANE.length == 5) {
        LANE_TIMER_MIN = 30
      } else {
        LANE_TIMER_MIN = 40
      }
      $("h1").html("" + LANE_TIMER_MIN + ":00");
      LANE_TIMER = LANE_TIMER_MIN * 60 * 1000
      $("div.lane").addClass("d-none")
      $("#lane"+lane).removeClass("d-none")
      if (lane != old_lane) {
        getLane()
      }
    }
    if (data.pause != undefined) {
      if (data.pause == true) {
        CountDown.Pause();
      } else {
        CountDown.Resume();
      }
    }
    if (data.start != undefined) {
      if (data.start == true && data.timer == undefined) {
        CountDown.Start(LANE_TIMER);
      } else if (data.start == false) {
        CountDown.Restart(LANE_TIMER);
      }
    }
    if (data.timer != undefined) {
        CountDown.Start(data.timer);
    }
    if (data.round != undefined) {
      $(".Scoreboard > h5 > span").text(data.round)
    }
    if (data.scoreTeam1 != undefined && data.scoreTeam2 != undefined) {
        scoreTeam1 = data.scoreTeam1
        scoreTeam2 = data.scoreTeam2
        $(".TeamScoreLeft").text("" + scoreTeam1)
        $(".TeamScoreRight").text("" + scoreTeam2)
    }
    if (data.shouldDisplayLaneHUD == true) {
      $("#lanes").removeClass("d-none")
    } else {
      $("#lanes").addClass("d-none")
    }
  });


  var outfitTrackerWSUrl = "wss://www.outfit-tracker.com:4567/facilities"
  var outfitTrackerWS = new WebSocket(outfitTrackerWSUrl);

  outfitTrackerWS.onopen = function (event) {
    if (lane != undefined) {
      getLane()
    }
  };
  outfitTrackerWS.onclose = function (event) {
    setTimeout(function(){
      outfitTrackerWS = new WebSocket(outfitTrackerWSUrl);
    }, 1000);
  };
  outfitTrackerWS.onerror = function (event) {
    setTimeout(function(){
      outfitTrackerWS = new WebSocket(outfitTrackerWSUrl);
    }, 1000);
  };
  outfitTrackerWS.onmessage = function (event) {
    body = JSON.parse(event.data)
    console.log(body)
    if (body.type == "Population") {
      return
    }
    if (body.init == true) {
      onSubscribe(body.facilityId, body.factionId);
      initDisplayLane(lane_index)
    } else {
      if (CountDown.IsRunning()) {
        if (body.factionId != body.oldFaction) {
          if (body.factionId == team1.faction) {
            scoreTeam1 += 1
            $(".TeamScoreLeft").text("" + scoreTeam1)
          }
          if (body.factionId == team2.faction) {
            scoreTeam2 += 1
            $(".TeamScoreRight").text("" + scoreTeam2)
          }
          socket.emit('updateScore', {
            scoreTeam1 : scoreTeam1,
            scoreTeam2 : scoreTeam2
          });
        }
      }
      updateBase(body.facilityId, body.factionId);
    }
  }

  function unSub() {
    for (let y = 0; y < LANE.length; y++) {
      var msg = {unsubscribe: {worldId: WORLD_ID, facilityId:LANE[y].id}};
      if (outfitTrackerWS.readyState == 1) {
        console.log("unsubscribe from", LANE[y].id);
        outfitTrackerWS.send(JSON.stringify(msg));
      }
    }
  }

  function getLane() {
    for (let y = 0; y < LANE.length; y++) {
      var msg = {subscribe: {worldId: WORLD_ID, facilityId:LANE[y].id}};
      if (outfitTrackerWS.readyState == 1) {
        console.log("subscribe to", LANE[y].id);
        outfitTrackerWS.send(JSON.stringify(msg));
      }
    }
  }

  function initTeam1() {
    $(".TeamLeft").removeClass("NC")
    $(".TeamLeft").removeClass("VS")
    $(".TeamLeft").removeClass("TR")
    factionString = "VS"
    if (team1.faction == NC_ID) {
      factionString = "NC"
    } else if (team1.faction == TR_ID) {
      factionString = "TR"
    }
    $(".TeamLeft").addClass(factionString)
    $(".TeamLeft > h2").text(team1.name)
  }

  function initTeam2() {
    $(".TeamRight").removeClass("NC")
    $(".TeamRight").removeClass("VS")
    $(".TeamRight").removeClass("TR")
    factionString = "VS"
    if (team2.faction == NC_ID) {
      factionString = "NC"
    } else if (team2.faction == TR_ID) {
      factionString = "TR"
    }
    $(".TeamRight").addClass(factionString)
    $(".TeamRight > h2").text(team2.name)
  }

  function onSubscribe(facilityId, factionId) {
    base_index = -1

    for (let y = 0; y < LANE.length; y++) {
      if (LANE[y].id == facilityId) {
        base_index=y
        break;
      }
    }

    if (base_index == -1) {
      return
    }

    if (factionId != undefined) {
      LANE[base_index].faction = factionId
    } else {
      LANE[base_index].faction = NSO_ID
    }
  }

  function updateBase(facilityId, factionId) {
    base_index = -1

    for (let y = 0; y < LANE.length; y++) {
      if (LANE[y].id == facilityId) {
        base_index=y
        break;
      }
    }

    if (base_index == -1) {
      return
    }

    side_of_faction = Side.LEFT
    if (factionId == LANE[LANE.length -1].faction) {
      side_of_faction = Side.RIGHT
    }

    if (factionId != undefined) {
      LANE[base_index].faction = factionId
    } else {
      LANE[base_index].faction = NSO_ID
    }
    initDisplayLane(lane_index)
  }

  function editFactionId(factionId) {
    if (team1 != undefined  && team2 != undefined) {
      if (team1.faction != factionId && team2.faction != factionId) {
        factionId = NSO_ID
      }
    }
    return factionId
  }

  function initDisplayLane(index) {
      var shouldCheckConflict = true
      // reset the conflcit on the lane
      $("#lane" + lane + "> ul > .Conflict").removeClass("Conflict")
      for (let y = 0; y < LANE.length; y++) {
        facilityId = LANE[y].id
        factionId = LANE[y].faction

        factionId = editFactionId(factionId)

        //init  factionClass
        var new_faction_class = "NS"
        if (factionId == NC_ID) {
          new_faction_class = "NC"
        } else if (factionId == TR_ID) {
          new_faction_class = "TR"
        } else if (factionId == VS_ID) {
          new_faction_class = "VS"
        }

        // reset the faction for the captured base
        $("." + facilityId).removeClass("NS")
        $("." + facilityId).removeClass("NC")
        $("." + facilityId).removeClass("TR")
        $("." + facilityId).removeClass("VS")
        // reset the status if base was NS
        $("." + facilityId).removeClass("AfterNC")
        $("." + facilityId).removeClass("AfterTR")
        $("." + facilityId).removeClass("AfterVS")

        $("." + facilityId).addClass(new_faction_class)

        if (factionId == NSO_ID || factionId == NONE_ID) {
          var yPrime = y + 1
          if (yPrime < LANE.length) {
            nextFactionId = LANE[yPrime].faction
            nextFactionId = editFactionId(nextFactionId)
            if (nextFactionId == NC_ID) {
              $("." + facilityId).addClass("AfterNC")
            } else if (nextFactionId == TR_ID) {
              $("." + facilityId).addClass("AfterTR")
            } else if (nextFactionId == VS_ID) {
              $("." + facilityId).addClass("AfterVS")
            }
          }
        } else if (shouldCheckConflict) {
          var yPrime = y + 1
          if (yPrime < LANE.length) {
            nextFactionId = LANE[yPrime].faction
            nextFactionId = editFactionId(nextFactionId)
            if (factionId != nextFactionId && nextFactionId != NSO_ID && nextFactionId != NONE_ID) {
              $("." + facilityId).addClass("Conflict")
            }
          }
        }
      }
  }

});
