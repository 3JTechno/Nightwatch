var contactDetails = require('../data/testData').contactDetails
var merchant = require('../data/merchantSettings').nightwatchTest2
var moment = require('moment')
var momentTimezone = require('moment-timezone')
var functions = require('../functions.js')

module.exports={

    before: function (browser) {

        //Login to booking manager
        browser.resizeWindow(1280, 800);
        functions.login(browser, merchant.username, merchant.password)
        functions.clear_appointments(browser)

    },
 
    'change_start_time': function(browser){

        //Test Summary: open existing booking, change the start time and verify booking has moved on the calendar

        //Test data preparation
        let uniqueId = functions.generate_unique_id()               // we use time from 1970 to always get a unique email address
        let slotId= functions.find_slotId(merchant.businessHours.startTime, merchant.staff1Id, merchant.timezone)
        let service = merchant.service1
        let newTime = '12:00pm'
        let newSlotId = functions.find_slotId(newTime, merchant.staff1Id, merchant.timezone)
        let note = 'Unique booking Id = ' + uniqueId

        //Page objects creation
        var calendar = browser.page.calendar()
        var appointmentTab = browser.page.appointmentTab()

        //Open booking form by clicking on calendar slot
        calendar.waitAndClick('//div[@id="' + slotId + '"]', appointmentTab)

        //Select service
        functions.switch_iframe('bookingForm', browser)
        appointmentTab
            .click('@serviceDropDown')
            .waitAndClick('//span[text()="' + service + '"]', appointmentTab)
            .expect.element('//span[@class="service-name"]').text.to.equal(service)
        
        //Add a note
        appointmentTab
            .waitAndClick('@memoBox', browser)
            .waitForElementVisible('@memoTextArea')
            .setValue('@memoTextArea', note)
            .expect.element('@memoTextArea').text.to.equal(note)

        //Save appointment 
        appointmentTab.click('@saveButton')

        //Verify Appointment is displayed on the calendar
        functions.switch_iframe("calendar", browser)
        calendar
            .waitForElementVisible('@appointmentSlotMemo')
            .expect.element('@appointmentSlotMemo').text.to.equal('"' + note + '"') //Calendar displays memo between quotes

        //Select appointment from calendar
        calendar.click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
        functions.switch_iframe('bookingForm', browser)

        //Change time
        appointmentTab
            .waitAndClick('@timeDropDown', browser)
            .moveToElement('//div[@class="item"][text()="' + newTime + '"]',10 ,10)
            .click('//div[@class="item"][text()="' + newTime + '"]')
            .expect.element('@timeDropDown').text.equal(newTime)

        //Save appointment
        appointmentTab.click('@saveButton')
        
        //Reopen appointment
        functions.switch_iframe("calendar", browser)
        calendar
            .waitForElementVisible('@addAppointment')
        browser
            .moveToElement("//div[@class='memoSummary'][text()='\"" + note + "\"']",10 ,10)
            .click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
        functions.switch_iframe("bookingForm", browser)

        //Check time has changed
        appointmentTab
            .waitForElementVisible('@serviceDropDown')
            .expect.element('@timeDropDown').text.equal(newTime)

        //Cancel appointment
        appointmentTab
            .waitAndClick('@cancelAppointment', browser)
            .waitForElementVisible('@confirmationYes')
            .click('@confirmationYes')
        functions.switch_iframe("calendar", browser)
        calendar
            .waitForElementVisible('@addAppointment')
            .expect.element("//div[@class='memoSummary'][text()='\"" + note + "\"']").to.not.be.present
    },

    after: function (browser){
        
        browser.end();
    }
}
