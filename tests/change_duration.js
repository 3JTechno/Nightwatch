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
         //Test data preparation
         let service = merchant.service1
         let uniqueId = functions.generate_unique_id()               // we use time from 1970 to always get a unique email address
         let note = 'Unique booking Id = ' + uniqueId
         let defautTime = merchant.businessHours.startTime
         let defaultSlotId = functions.find_slotId(defautTime, merchant.staff1Id, merchant.timezone)
         let defaultDuration = merchant.service1Duration
         let newDuration = '00:45'
 
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

        //Verify duration duration is compliant with the service selected
        appointmentTab.expect.element('@duration').to.have.attribute('value').equals(defaultDuration);
         
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
             .waitForElementVisible('@addAppointment')
             .moveToElement("//div[@class='memoSummary'][text()='\"" + note + "\"']",10 ,10)
             .click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
             .switchFrame('bookingForm')
 
         //Check duration has changed and close booking form
         appointmentTab
             .waitForElementVisible('@duration')
             .expect.element('@duration').to.have.attribute('value').equals(newDuration)
         appointmentTab
             .click('@closeBtn')
             .switchFrame('calendar-day-view')

         //Reopen appointment
         calendar
             .waitForElementVisible('@addAppointment')
             .moveToElement("//div[@class='memoSummary'][text()='\"" + note + "\"']",10 ,10)
             .click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
             .switchFrame('bookingForm')
 
         //Cancel appointment
         appointmentTab
             .waitAndClick('@cancelAppointment')
             .waitAndClick('@confirmationYes')
             .switchFrame('calendar-day-view')
 
         //Verify appointment no longer appear on calendar
         calendar
             .expect.element("//div[@class='memoSummary'][text()='\"" + note + "\"']").to.not.be.present
     },

     after: function (browser){
        
        browser.end();
    }
}

