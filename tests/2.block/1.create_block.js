var merchant = require('../../data/merchantSettings').nightwatchTest3
var functions = require('../../functions.js')
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
        let time2 = moment(merchant.businessHours.startTime, 'HH:mma').add('30', 'minute') //Seconde block will be created 30 mins later
        let block2= functions.find_slotId(time2, merchant.staff1Id, merchant.timezone)

        //Page objects creation
        var calendar = browser.page.calendar()
        var appointmentTab = browser.page.appointmentTab()

        //Verify that no block already exists on the calendar page
        calendar.expect.element('@blockText').to.not.be.present

        //Open booking form by clicking on calendar slot
        calendar.waitAndClick(calendar.el('@slot', block1))

        //Save appointment 
        appointmentTab
            .switchFrame('bookingForm')
            .waitAndClick('@saveButton')

        //Verify block is displayed on the calendar
        calendar
            .switchFrame('calendar-day-view')
            .waitForElementVisible('@blockText')
            .expect.element('@blockText').to.be.visible

        //Hover on a slot and click "Block"
        calendar
            .moveToElement(calendar.el('@slot', block2), 10, 10)
            .waitForElementVisible('@blockBtn')
            .click('@blockBtn')
        calendar
            .api.pause(1000)
        calendar
            .api.elements('xpath', '//div[@class="heldtext"][text()="Blocked"]', function(result){
                this.assert.equal(result.value.length, "2") //Verify that 2 blocks are now displayed on the calendar
            })   
    },

    after: function (browser){
        functions.clear_appointments(browser)
        browser.end();
    }
}
