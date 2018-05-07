var contactDetails = require('../data/testData').contactDetails
var merchantData = require('../data/merchantSettings').nightwatchTest1
var moment = require('moment')
var momentTimezone = require('moment-timezone')

module.exports={

    before: function (browser) {
        browser.resizeWindow(1280, 800);
    },
 
    'first_test': function(browser){

        //Login to Booking Manager
        browser.url(browser.launchUrl);
  
        var genbook = browser.page.pageObject();
        genbook
            .waitForElementVisible('@logInButton')
            .click('@logInButton')
            .waitForElementVisible('@email')
            .clearValue('@email')
            .setValue('@email', merchantData.username)
            .clearValue('@password')
            .setValue('@password', merchantData.password)
            .click('@loginSubmitButton')
            .waitForElementVisible("//iframe[@id='ps-group-day']")

        //Open Booking by clicking on " + " button
        browser.frame("ps-group-day") 
        genbook
            .waitForElementVisible('@addAppointment')
        browser.pause(4000) //here we wait until Javascript (JQuery) finishes his job
        genbook.click('@addAppointment')
        browser
            .frameParent()
            .waitForElementVisible("//iframe[@id='booking_frame']")
            .frame("booking_frame")
        genbook
            .waitForElementVisible('@staffDropDown')
            .expect.element('@staffDropDown').text.equal(merchantData.staff1)
            
        //Verify defaut Date picked is today's date
        todayDate = momentTimezone.tz(merchantData.timezone).format('MMM DD, YYYY'); // Apr 30, 2018
        genbook.expect.element('@dateDropDown').to.have.attribute('value').equals(todayDate) //can fail when close to day

        //Verify that default time is first available slot of staff selected
        //startTime = merchantData.businessHours.start
        //genbook.expect.element('@timeDropDown').text.to.equal(startTime)
 
        //Verify all service are listed and select another one
        genbook.click('@serviceDropDown')
        genbook.expect.element('//span[text()="' + merchantData.service1 + '"]').to.be.visible 
        genbook.expect.element('//span[text()="' + merchantData.service21 + '"]').to.be.visible 
        genbook.expect.element('//span[text()="' + merchantData.serviceB1 + '"]').to.be.visible 
        genbook.click('//span[text()="' + merchantData.serviceB1 + '"]')
        genbook.expect.element('//span[@class="service-name"]').text.to.equal(merchantData.serviceB1)
        
        //Verify all staff are listed and select another one
        genbook.expect.element('//div[text()="' + merchantData.staff1 + '"]').to.be.visible 
        genbook.click('@staffDropDown')
        genbook.expect.element('//div[text()="' + merchantData.staff1 + '"]').to.be.visible 
        genbook.expect.element('//div[text()="' + merchantData.staff2 + '"]').to.be.visible 
        genbook.expect.element('//div[text()="' + merchantData.staff1 + '"]').to.be.visible 

        //Search a customer with the 3 first letters
        genbook
            .clearValue('@customerSearch')
            .setValue('@customerSearch', "jer")
            .expect.element('//span[@class="search_email "]').text.to.equal(merchantData.customer1.email)
        genbook
            .click('//span[text()="' + merchantData.customer1.email + '"]')
            .expect.element('//div[@title="Customer"]/div[@class="default text"]/div').text.to.equal(merchantData.customer1.firstName.capitalizeFirstLetter() + " " + merchantData.customer1.lastName.capitalizeFirstLetter())

        //Save appointment 
        genbook.click('@saveButton')

        //Verify Appointment is displayed on the calendar
        browser
            .frameParent()
            .waitForElementVisible("//iframe[@id='ps-group-day']")
            .frame("ps-group-day")
        genbook.waitForElementVisible('@appointmentSlotName')
        genbook.expect.element('@appointmentSlotName').text.to.equal(merchantData.customer1.firstName + " " + merchantData.customer1.lastName)
        genbook.expect.element('@appointmentSlotService').text.to.equal(merchantData.serviceB1)
        genbook.expect.element('@appointmentSlotPhone').text.to.equal(merchantData.customer1.phone)

        //Select appointment slot and cancel
        browser.click('//div[@class="nameSummary"]/div[@class="service"][text()="' + merchantData.serviceB1 + '"]/parent::div')
        browser
            .frameParent()
            .waitForElementVisible("//iframe[@id='booking_frame']")
            .frame("booking_frame")
        
        genbook
            .waitForElementNotVisible('//span[@class="service-name"]')
            .click('@cancelAppointment')
            .waitForElementVisible('@confirmationYes')
            .click('@confirmationYes')
            .waitForElementNotVisible("//iframe[@id='booking_frame']")
            .expect.element('@appointmentSlotName').to.not.be.visible

    },

    after: function (browser){
        browser.end();
    }
}


String.prototype.capitalizeFirstLetter = function() {
    return this.replace(/\b\w/g, l => l.toUpperCase());
}