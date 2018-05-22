var merchant = require('../data/merchantSettings').nightwatchTest3
var functions = require('../functions.js')

module.exports={

    before: function (browser) {

        //Login to booking manager
        browser.resizeWindow(1280, 800);
        functions.login(browser, merchant.username, merchant.password)
        functions.clear_appointments(browser)

    },
 
    tags: ['change_start_time'],
    'change_start_time': function(browser){

        //Test Summary: open existing booking, change the start time and verify booking has moved on the calendar.
        //Then move it back to its original start time by draging and dropping the appointment.

        //Test data preparation
        let service = merchant.service1
        let uniqueId = functions.generate_unique_id()               // we use time from 1970 to always get a unique email address
        let note = 'Unique booking Id = ' + uniqueId
        let defautTime = merchant.businessHours.startTime
        let defaultSlotId= functions.find_slotId(defautTime, merchant.staff1Id, merchant.timezone)
        let newTime = '12:00pm'

        //Page objects creation
        var calendar = browser.page.calendar()
        var appointmentTab = browser.page.appointmentTab()

        //Open booking form by clicking on calendar slot
        calendar.waitAndClick('//div[@id="' + defaultSlotId + '"]')

        //Select service
        appointmentTab
            .switchFrame('bookingForm')
            .click('@serviceDropDown')
            .waitAndClick('//span[text()="' + service + '"]')
            .expect.element('//span[@class="service-name"]').text.to.equal(service)
        
        //Add a note
        functions.add_note(note, appointmentTab)

        //Save appointment 
        appointmentTab.click('@saveButton')

        //Verify Appointment is displayed on the calendar
        calendar
            .switchFrame('calendar-day-view')
            .waitForElementVisible('@appointmentSlotMemo')
            .expect.element('@appointmentSlotMemo').text.to.equal('"' + note + '"') //Calendar displays memo between quotes

        //Select appointment from calendar
        calendar
            .click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
            .switchFrame('bookingForm')

        //Change time
        appointmentTab
            .waitAndClick('@timeDropDown')
            .moveToElement('//div[@class="item"][text()="' + newTime + '"]',10 ,10)
            .click('//div[@class="item"][text()="' + newTime + '"]')
            .expect.element('@timeDropDown').text.equal(newTime)

        //Save appointment
        appointmentTab
            .click('@saveButton')
            .switchFrame('calendar-day-view')

        //Reopen appointment
        calendar
            .waitForElementVisible('@addAppointment')
            .moveToElement("//div[@class='memoSummary'][text()='\"" + note + "\"']",10 ,10)
            .click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
            .switchFrame('bookingForm')

        //Check time has changed and close booking form
        appointmentTab
            .waitForElementVisible('@serviceDropDown')
            .expect.element('@timeDropDown').text.equal(newTime)
        appointmentTab
            .click('@closeBtn')
            .switchFrame('calendar-day-view')

        //Drag and drop to original time slot
        calendar
            .waitForElementVisible("//div[@class='memoSummary'][text()='\"" + note + "\"']")
            .moveToElement("//div[@class='memoSummary'][text()='\"" + note + "\"']", 10, 10)
            .waitForElementVisible('//div[@id="' + defaultSlotId + '"]')
         browser   
            .mouseButtonDown(0)
            .moveToElement('//div[@id="' + defaultSlotId + '"]',10, 50)
            .mouseButtonUp(0)
        
        //Reopen appointment
        browser
            .pause(1000) //Here we wait until javascript finishes executing the drag and drop action
            .click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
            .switchFrame('bookingForm')

        //Check time has changed
        appointmentTab
            .waitForElementVisible('@serviceDropDown')
            .expect.element('@timeDropDown').text.equal(merchant.businessHours.startTime)

        //Cancel appointment
        appointmentTab
            .waitAndClick('@cancelAppointment')
            .waitAndClick('@confirmationYes')
            .switchFrame('calendar-day-view')
            
    },

    after: function (browser){
        // functions.clear_appointments(browser)
        browser.end();
    }
}
