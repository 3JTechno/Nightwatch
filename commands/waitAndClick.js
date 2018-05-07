var util = require('util');
var events = require('events');

function waitAndClick() {
  events.EventEmitter.call(this);
}

util.inherits(waitAndClick, events.EventEmitter);

waitAndClick.prototype.command = function(element,browser) {
  browser
  .waitForElementVisible(element)
  .click(element)

  setTimeout(()=>{
    this.emit('complete');
  },0);

  return this;
};

module.exports = waitAndClick;
