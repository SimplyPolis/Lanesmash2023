const WebSocket   = require('ws');

const match = require('./match.js');
var serviceid=require('./serviceid.json');
serviceid=serviceid["serviceid"]


var runningWs = null;
var subAttempt = 0;
var unsubAttempt = 0;

function connect() {
var WSUrl = "wss://push.planetside2.com/streaming?environment=ps2&service-id=s:"+serviceid
var ws = new WebSocket(WSUrl);

runningWs = ws;
ws.on('open', function open() {
  subAttempt += 1;
});

ws.on('message', function (data) {
  	
	match.dealWithTheData(data)
});

ws.on('close', function (data) {
  console.log('Socket is closed. Reconnect will be attempted in 1 second.', data);
    setTimeout(function() {
      connect();
      subscribe(runningWs);
    }, 1000);
  
});

ws.on('error', function (data) {
  ws.close();
});

}

connect();


function subscribe(ws) {

    if (ws.readyState == 1) {
      var msg = {"service":"event","action":"subscribe","worlds":["19"],"eventNames":["FacilityControl"]};
      ws.send(JSON.stringify(msg));
    }
  
}

function unsubscribe(ws) {
  // unsubscribes from all events
  unsubAttempt += 1;
  try {
   
      if (ws.readyState == 1) {
        var msg = {"service":"event","action":"clearSubscribe","worlds":["19"],"eventNames":["FacilityControl"]};
        ws.send(JSON.stringify(msg));
      }
    

  }
  catch(err) {
    console.log(err)
    if (ws.readyState == 1) {
      unsubscribe(ws);
    }
  }
}

function setMatch() {
  subscribe(runningWs);
}

function resetMatch() {
  unsubscribe(runningWs);
}


exports.setMatch = setMatch;
exports.resetMatch = resetMatch;
