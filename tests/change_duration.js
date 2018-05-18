var merchant = require('../data/merchantSettings').nightwatchTest3
var functions = require('../functions.js')

module.exports={

    before: function (browser) {

        //Login to booking manager
        browser.resizeWindow(1280, 800);
        functions.login(browser, merchant.username, merchant.password)
        functions.clear_appointments(browser)

    },
 
    tags: ['change_duration'],
    'change_duration': function(browser){

        //Test Summary: open existing offline booking, change the duration and verify booking has changed duration on the calendar.

    },

    after: function (browser){
        
        browser.end();
    }
}

