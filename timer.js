const app = require('./app.js'),
match = require('./match.js')

class Timer {
  constructor() {
    this.running = false;
    this.minutes = 0
    this.currentTime = undefined
    this.endTime = undefined
    this.timeoutValue = undefined
  }

  setMinutes(minutes) {
    this.minutes = minutes;
  }
  getMinutes(minutes) {
    return this.minutes;
  }

  sendTimerInfo() {
    if (this.endTime && this.currentTime) {
      var timer = new Date();
      timer.setTime( this.endTime - this.currentTime );
      var hours = timer.getUTCHours();
      var minutes = (hours * 60) + timer.getMinutes();
      var seconds = timer.getSeconds();
      console.log((minutes >= 10 ? minutes : "0" + minutes) + ":" + (seconds >= 10 ? seconds : "0" + seconds))
      app.send("timerInfo", {
        timer : timer.getTime(),
        minutes: minutes,
        seconds: seconds
      });
    } else {
      app.send("timerInfo", {
        minutes: this.minutes,
        seconds: 0
      });
    }
  }

  getTime() {
    var timer = new Date();
    timer.setTime( this.endTime - this.currentTime );
    return timer.getTime()
  }

  startTimer() {
    if (this.timeoutValue != undefined) {
      clearTimeout(this.timeoutValue)
    }
    this.running = true;
    var timeout = this.minutes * 60 * 1000
    this.currentTime = ( new Date() ).getTime();
    this.endTime = ( new Date() ).getTime() + timeout;
    this.sendTimerInfo()
    this.updateTimer(this);
  }

  stopTimer() {
    if (this.timeoutValue != undefined) {
      clearTimeout(this.timeoutValue)
    }
    this.currentTime = this.endTime
    this.running = false;
    this.sendTimerInfo();
    if (match.getRound() == 2) {
      match.matchEnded()
    } else {
      match.roundEnded()
    }
  }

  updateTimer(timerInstance) {
    var now  =  ( new Date() ).getTime();
    if ( now < timerInstance.endTime ) {
      timerInstance.timeoutValue = setTimeout( timerInstance.updateTimer, 1000 , timerInstance);
    } else {
      timerInstance.stopTimer();
    }
    if (timerInstance.running) {
      timerInstance.currentTime = now
    }
    timerInstance.sendTimerInfo()
  }

  resetTimer() {
    this.running = false;
    this.minutes = 0;
    this.currentTime = undefined
    this.endTime = undefined
    if (this.timeoutValue != undefined) {
      clearTimeout(this.timeoutValue)
    }
  }

}

module.exports = Timer;
