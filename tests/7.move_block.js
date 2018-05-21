var contactDetails = require('../data/testData').contactDetails;
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
 
    tags: ['move_block'],
    'move_block': function(browser){

        //Test Summary: edit a block with the booking form and verify if changes are displayed on the calendar.

        //Test data preparation
        let time = merchant.businessHours.startTime //first block will be created at merchant start time
        let block= functions.find_slotId(time, merchant.staff1Id, merchant.timezone)
        let newTime = '12:00pm'
        let uniqueId = functions.generate_unique_id();               // we use time from 1970 to always get a unique email address
        let email = uniqueId + "@gmail.com";                         //we create dynamic email to avoid conflict with existing customer
        let note = "Unique booking Id = " + uniqueId;

        //Page objects creation
        var calendar = browser.page.calendar()
        var appointmentTab = browser.page.appointmentTab()
        var customerTab = browser.page.customerTab();

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

        //Change time
        appointmentTab
            .waitAndClick('@timeDropDown')
            .moveToElement('//div[@class="item"][text()="' + newTime + '"]',10 ,10)
            .click('//div[@class="item"][text()="' + newTime + '"]')
            // .verify.value('@timeDropDown', newTime)
            .expect.element('@timeDropDown').text.equal(newTime)

        //Save appointment
        appointmentTab
            .click('@saveButton')
            .switchFrame('calendar-day-view')

        //Reopen appointment
        calendar
            .waitAndClick('@blockText')
            .switchFrame('bookingForm')

        //Check time has changed and close booking form
        appointmentTab
            .waitForElementVisible('@timeDropDown')
            // .verify.value('@timeDropDown', newTime)
            .expect.element('@timeDropDown').text.equal(newTime)
        appointmentTab
            .click('@saveButton')
            .switchFrame('calendar-day-view')
        
        //Drag and drop to original time slot
        calendar
            .waitForElementVisible('@blockText')
            .moveToElement('@blockText', 10, 10)
            .waitForElementVisible('//div[@id="' + block + '"]')
         browser   
            .mouseButtonDown(0)
            .moveToElement('//div[@id="' + block + '"]',10, 20)
            .mouseButtonUp(0)
        
        //Reopen appointment
        calendar
            .waitAndClick('@blockText')
            .switchFrame('bookingForm')

        //Check time has changed and close boking form
        appointmentTab
            .waitForElementVisible('@timeDropDown')
            // .verify.value('@timeDropDown', time)
            .expect.element('@timeDropDown').text.equal(time)
        appointmentTab
            .click('@saveButton')
            .switchFrame('calendar-day-view')
    },

    after: function (browser){
        functions.clear_appointments(browser)
        browser.end();
    }
}