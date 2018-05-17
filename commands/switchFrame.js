var util = require('util');
var events = require('events');

function switchFrame() {
  events.EventEmitter.call(this);
}

util.inherits(switchFrame, events.EventEmitter);

switchFrame.prototype.command = function(frame){

    //Switch between calendar iframe  and booking form iframe
    if(frame == "bookingForm"){
        this.api
            .frameParent()
            .waitForElementVisible("//iframe[@id='booking_frame']")
            .frame("booking_frame")
            .pause(2000) //Need to find a way to assert when all elements are fully loaded instead of using a wait fct

    }else if(frame == "calendar-day-view"){
        this.api
            .frameParent()
            .waitForElementVisible("//iframe[@id='ps-group-day']")
            .frame("ps-group-day")
            .pause(4000) //Need to find a way to assert when all elements are fully loaded instead of using a wait fct

    }else if(frame == "calendar-week-view"){
        this.api
            .frameParent()
            .waitForElementVisible("//iframe[@id='ps-staff-week']")
            .frame("ps-staff-week")
            .pause(4000) //Need to find a way to assert when all elements are fully loaded instead of using a wait fct
    }

  setTimeout(()=>{
    this.emit('complete');
  },0);

  return this;
};

module.exports = switchFrame;
