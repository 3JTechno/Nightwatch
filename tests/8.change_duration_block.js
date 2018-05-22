var merchant = require('../data/merchantSettings').nightwatchTest3
var functions = require('../functions.js')
var moment = require('moment')

module.exports={

    before: function (browser) {

        //Login to booking manager
        browser.resizeWindow(1280, 800);
        functions.login(browser, merchant.username, merchant.password)
        functions.clear_appointments(browser)

    },
 
    tags: ['change_duration_block'],
    'change_duration_block': function(browser){

        //Test Summary: create a block with the booking form and verify it is displayed on the calendar.
        //Create a block using mouse hover on empty slot ("block", "Offline", "Away")

        //Test data preparation
        let time = merchant.businessHours.startTime //first block will be created at merchant start time
        let block= functions.find_slotId(time, merchant.staff1Id, merchant.timezone)
        let defaultDuration = '00:30'
        let newDuration = '00:45'

        //Page objects creation
        var calendar = browser.page.calendar()
        var appointmentTab = browser.page.appointmentTab()

        //Verify that no block already exists on the calendar page
        calendar.expect.element('@blockText').to.not.be.present

        //Hover on a slot and click "Block"
        calendar
            .moveToElement(calendar.el('@slot', block), 10, 10)
            .waitForElementVisible('@blockBtn')
            .click('@blockBtn')

        //Verify block is displayed on the calendar
        calendar
            .waitForElementVisible('@blockText')
            // .verify.visible('@blockText')
            .expect.element('@blockText').to.be.visible

        //Open booking form by clicking on calendar slot
        calendar
            .waitAndClick('@blockText')
            .switchFrame('bookingForm')

        //Verify duration is set to default
        appointmentTab.expect.element('@duration').to.have.attribute('value').equals(defaultDuration)

        //Change duration
        appointmentTab
            .click('@duration')
            .setValue('@duration', newDuration)
            .expect.element('@duration').to.have.attribute('value').equals(newDuration)

        //Save appointment
        appointmentTab
            .click('@saveButton')
            .switchFrame('calendar-day-view')

        //Reopen appointment
        calendar
            .waitAndClick('@blockText')
            .switchFrame('bookingForm')
        
        //Check duration has changed and close booking form
        appointmentTab
            .waitForElementVisible('@duration')
            .expect.element('@duration').to.have.attribute('value').equals(newDuration)
        appointmentTab
            .click('@closeBtn')
            .switchFrame('calendar-day-view')
    },

    after: function (browser){
        browser.end();
    }
}