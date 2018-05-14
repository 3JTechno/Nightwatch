var contactDetails = require('../data/testData').contactDetails
var merchantData = require('../data/merchantSettings').nightwatchTest1
var moment = require('moment')
var momentTimezone = require('moment-timezone')
var functions = require('../functions.js')

module.exports={

    before: function (browser) {
        browser.resizeWindow(1280, 800);
    },
 
    'create_offline_booking': function(browser){

        //Test Summary: click on a slot in the calendar, verify Date, time, staff, service. Select a customer
        //and save appointment. Verify appointment is displayed on the calendar and delete it.

        let uniqueId = functions.generate_unique_id() // we use time from 1970 to always get a unique email address
        var appointmentTab = browser.page.pageObject()
        var customerTab = browser.page.customerTab()

        //Login to booking manager
        browser.url(browser.launchUrl);
        appointmentTab
            .waitAndClick('@logInButton', browser)
            .waitAndClick('@loginEmail', browser)
            .setValue('@loginEmail', merchantData.username)
            .clearValue('@loginPassword')
            .setValue('@loginPassword', merchantData.password)
            .click('@loginSubmitButton')
        functions.switch_iframe("calendar", browser)

        //Open booking form by clicking on calendar slot
        let dayNumber = functions.find_day_number()
        browser
            .waitForElementVisible('//div[@id="tsE' + dayNumber + 'H0m0s0_PT30M_' + merchantData.staff1Id + '"]')
            .pause(4000) //here we wait until Javascript (JQuery) finishes his job
            .click('//div[@id="tsE' + dayNumber + 'H0m0s0_PT30M_' + merchantData.staff1Id + '"]')
        functions.switch_iframe("bookingForm", browser)

        //Verify that Staff 1 is selected
        appointmentTab
            .waitForElementVisible('@staffDropDown')
            .expect.element('@staffDropDown').text.equal(merchantData.staff1)
            
        //Verify defaut Date picked is today's date
        todayDate = momentTimezone.tz(merchantData.timezone).format('MMM DD, YYYY'); // Apr 30, 2018
        appointmentTab.expect.element('@dateDropDown').to.have.attribute('value').equals(todayDate) //can fail when close to day

        //Verify default time is compliant with the slot selected
        appointmentTab.expect.element('@timeDropDown').text.to.equal("12:00am")

        //Verify default duration = 30 mins 
        appointmentTab.expect.element('@duration').to.have.attribute('value').equals("00:30")
 
        //Verify all services are listed and select one
        appointmentTab.click('@serviceDropDown')
        appointmentTab.expect.element('//span[text()="' + merchantData.service1 + '"]').to.be.visible 
        appointmentTab.expect.element('//span[text()="' + merchantData.service2 + '"]').to.be.visible 
        appointmentTab.click('//span[text()="' + merchantData.service2 + '"]')
        appointmentTab.expect.element('//span[@class="service-name"]').text.to.equal(merchantData.service2)
        
        //Verify that Duration field has been updated according to service selected
        appointmentTab.expect.element('@duration').to.have.attribute('value').equals(merchantData.service2Duration)

        //Verify staff is selected
        appointmentTab.expect.element('//div[text()="' + merchantData.staff1 + '"]').to.be.visible 

        //Enter customer details
        let email = uniqueId + "@gmail.com"

        appointmentTab.click('@addCustomer')
        customerTab
            .waitForElementVisible('@firstName')
            .setValue('@firstName', merchantData.customer1.firstName)
            .setValue('@lastName', merchantData.customer1.lastName)
            .setValue('@email', email)
            .setValue('@phone', merchantData.customer1.phone)
            .click('@save')
            .waitForElementVisible('//label[text()="Update customer record"]')
            .click('@back')

        //Verify correct customer is selected
        appointmentTab.expect.element('//div[@title="Customer"]/div[@class="default text"]/div').text.to.equal(merchantData.customer1.firstName.capitalizeFirstLetter() + " " + merchantData.customer1.lastName.capitalizeFirstLetter())
        appointmentTab.expect.element('@email').text.to.equals(email)
        appointmentTab.expect.element('@phone').text.to.equals(merchantData.customer1.phone)

        //Add a note
        let note = "Unique booking Id = " + uniqueId
        appointmentTab
            .waitAndClick('@memoBox', browser)
            .waitForElementVisible('@memoTextArea')
            .setValue('@memoTextArea', note)
            .expect.element('@memoTextArea').text.to.equal(note)

        //Save appointment 
        appointmentTab.click('@saveButton')

        //Verify Appointment is displayed on the calendar
        functions.switch_iframe("calendar", browser)
        appointmentTab.waitForElementVisible('@appointmentSlotName')
        appointmentTab.expect.element('@appointmentSlotName').text.to.equal(merchantData.customer1.firstName.capitalizeFirstLetter() + " " + merchantData.customer1.lastName.capitalizeFirstLetter())
        appointmentTab.expect.element('@appointmentSlotService').text.to.equal(merchantData.service2)
        appointmentTab.expect.element('@appointmentSlotPhone').text.to.equal(merchantData.customer1.phone)
        appointmentTab.expect.element('@appointmentSlotMemo').text.to.equal('"' + note + '"') //Calendar displays memo between quotes

        //Select appointment from calendar and delete.
        appointmentTab.click("//div[@class='memoSummary'][text()='\"" + note + "\"']")
        functions.switch_iframe("bookingForm", browser)
        appointmentTab
            .waitForElementVisible('//span[@class="service-name"]')
            .click('@cancelAppointment')
            .waitForElementVisible('@confirmationYes')
            .click('@confirmationYes')
        functions.switch_iframe("calendar", browser)
        appointmentTab
            .waitForElementVisible('@addAppointment')
            .expect.element("//div[@class='memoSummary'][text()='\"" + note + "\"']").to.not.be.present

    },

    after: function (browser){
        browser.end();
    }
}


String.prototype.capitalizeFirstLetter = function() {
    return this.replace(/\b\w/g, l => l.toUpperCase());
}