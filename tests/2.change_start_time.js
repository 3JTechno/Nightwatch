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
      
    },
 
    'change_start_time': function(browser){

        //Test Summary: open existing booking, change the start time and verify booking has moved on the calendar

        //Test data preparation
        let uniqueId = functions.generate_unique_id()               // we use time from 1970 to always get a unique email address
        let slotId= functions.find_slotId(merchant.businessHours.startTime, merchant.staff1Id, merchant.timezone)
        let service = merchant.service1
        let newTime = "12:00am"
        let newSlotId = functions.find_slotId(newTime, merchant.staff1Id, merchant.timezone)
        let note = "Unique booking Id = " + uniqueId

        //Page objects creation
        var appointmentTab = browser.page.pageObject()

        //Open booking form by clicking on calendar slot
        browser
            .waitForElementVisible('//div[@id="' + slotId + '"]')
            .pause(4000) //here we wait until Javascript (JQuery) finishes his job
            .click('//div[@id="' + slotId + '"]')
        functions.switch_iframe("bookingForm", browser)

        //Select service
        appointmentTab.expect.element('@staffDropDown').text.equal(merchant.staff1) //Default Staff
        appointmentTab
            .click('@serviceDropDown')
            .click('//span[text()="' + service + '"]')
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
        appointmentTab.waitForElementVisible('@appointmentSlotMemo')
        appointmentTab.expect.element('@appointmentSlotMemo').text.to.equal('"' + note + '"') //Calendar displays memo between quotes

        //Select appointment from calendar and change time
        appointmentTab.click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
        functions.switch_iframe("bookingForm", browser)
        appointmentTab
            .waitForElementVisible('@serviceDropDown')
            .waitAndClick('@timeDropDown', browser)
        browser
            .moveToElement('//div[@class="item"][text()="' + newTime + '"]',10 ,10)
            .pause(4000)
            .click('//div[@class="item"][text()="' + newTime + '"]')
        appointmentTab.expect.element('@timeDropDown').text.equal(newTime)
        appointmentTab
            .click('@saveButton')
        functions.switch_iframe("calendar", browser)
        appointmentTab
            .waitForElementVisible('@addAppointment')
        browser 
            .moveToElement("//div[@class='memoSummary'][text()='\"" + note + "\"']",10 ,10)
            .getAttribute("//div[@class='memoSummary'][text()='\"" + note + "\"']", 'Id', function(result){
                this.assert.equal(result.value, newSlotId)
            })
    },

    after: function (browser){
        browser.end();
    }
}


String.prototype.capitalizeFirstLetter = function() {
    return this.replace(/\b\w/g, l => l.toUpperCase());
}