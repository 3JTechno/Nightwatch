var merchant = require('../data/merchantSettings').nightwatchTest2
var functions = require('../functions.js')
var moment = require('moment')

module.exports={

    before: function (browser) {

        //Login to booking manager
        browser.resizeWindow(1280, 800);
        functions.login(browser, merchant.username, merchant.password)
        functions.clear_appointments(browser)

    },
 
    tags: ['create_block'],
    'create_block': function(browser){

        //Test Summary: create a block with the booking form and verify it is displayed on the calendar.
        //Create a block using mouse hover on empty slot ("block", "Offline", "Away")

        //Test data preparation
        let time1 = merchant.businessHours.startTime //first block will be created at merchant start time
        let block1= functions.find_slotId(time1, merchant.staff1Id, merchant.timezone)

        
    },

    after: function (browser){
        functions.clear_appointments(browser)
        browser.end();
    }
}