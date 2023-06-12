const { CensusClient } = require('ps2census');

const match = require('./match.js');
var serviceid=require('./serviceid.json');
serviceid=serviceid["serviceid"]
const subscriptions = {
  worlds: ['19'],
  eventNames: ['FacilityControl'],
};


const client = new CensusClient(serviceid, 'ps2', {
  streamManager: {
    subscription: subscriptions,
  },
});
client.on('facilityControl', event => {
	match.dealWithTheData(event)
}); 
client.on('ready', () => {
	console.log("ready");
}); 
client.on('reconnecting', () => {
	console.log("reconnecting");
}); 
client.on('disconnected', () => {
	console.log("disconnected");
});
client.on('error', error => {
	console.log(error)
});  

function setMatch() {
  client.watch();
}

function resetMatch() {
	client.resubscribe(reset=true);
}


exports.setMatch = setMatch;
exports.resetMatch = resetMatch;
