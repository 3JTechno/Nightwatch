var contactDetails = require('../data/testData').contactDetails
var merchant = require('../data/merchantSettings').nightwatchTest2
var momentTimezone = require('moment-timezone')
var functions = require('../functions.js')

module.exports={

    before: function (browser) {

        //Login to booking manager
        browser.resizeWindow(1280, 800);
        functions.login(browser, merchant.username, merchant.password)
        functions.clear_appointments(browser)

    },
 
    'email_phone_validation': function(browser){

        //Test Summary: open a booking, go in customer tab. Try 2 wrong formatted emails 
        //and 2 wrong formatted phone numbers and verify that proper behaviour (message, field color) is seen.

        //Test data preparation
        let uniqueId = functions.generate_unique_id()               // we use time from 1970 to always get a unique email address
        let email = uniqueId + "@gmail.com"                         //we create dynamic email to avoid conflict with existing customer  
        let slotId= functions.find_slotId(merchant.businessHours.startTime, merchant.staff1Id, merchant.timezone)
        let todayDate = momentTimezone.tz(merchant.timezone).format('MMM DD, YYYY'); // e.g. "Apr 30, 2018"

        //Page objects creation
        var calendar = browser.page.calendar()
        var appointmentTab = browser.page.appointmentTab()
        var customerTab = browser.page.customerTab()

        //Open booking form by clicking on calendar slot
        calendar
            .waitAndClick('//div[@id="' + slotId + '"]')
            .switchFrame('bookingForm')

        //Enter customer details
        appointmentTab.click('@addCustomer')
        customerTab
            .waitForElementVisible('@firstName')
            .setValue('@firstName', contactDetails.firstName)
            .setValue('@lastName', contactDetails.lastName)
            .setValue('@phone', contactDetails.phone_not_fomratted) //Here for some reason Booking form doesn't accept "formatted numbers" the second time :-() ????

        //Enter wrong email 1
        //The validation process currently highlighs any wrong field and then display a error message when click out and in again. 
        customerTab
            .setValue('@email', contactDetails.email_incorrect_1)
            .expect.element('@email').to.have.attribute('class').to.not.contain('error-border')
        customerTab
            .click('@phone')
            .click('@email')
            .expect.element('//span[text()="You must enter a valid email"]').to.be.visible

        //Enter wrong email 2
        customerTab
            .clearValue('@email')
            .setValue('@email', email)
            .expect.element('@email').to.have.attribute('class').to.not.contain('error-border')
        customerTab
            .clearValue('@email')
            .setValue('@email', contactDetails.email_incorrect_2)
            .expect.element('@email').to.have.attribute('class').to.contain('error-border')
        customerTab
            .click('@phone')
            .click('@email')
            .expect.element('//span[text()="You must enter a valid email"]').to.be.visible
        customerTab
            .clearValue('@email')
            .setValue('@email', email)
            .expect.element('@email').to.have.attribute('class').to.not.contain('error-border')

        //Enter wrong phone 1
        customerTab
            .clearValue('@phone')
            .setValue('@phone', contactDetails.phone_incorrect_1)
            .expect.element('@phone').to.have.attribute('class').to.contain('error-border')
        customerTab
            .click('@email')        
            .click('@phone')
            .expect.element('//span[text()="Phone number is invalid"]').to.be.visible

        //Enter wrong phone 2
        customerTab
            .clearValue('@phone')
            .setValue('@phone', contactDetails.phone_not_fomratted)
            .expect.element('@phone').to.have.attribute('class').to.not.contain('error-border')
        customerTab
            .clearValue('@phone')
            .setValue('@phone', contactDetails.phone_incorrect_2)
            .expect.element('@phone').to.have.attribute('class').to.contain('error-border')
        customerTab
            .click('@email')
            .click('@phone')
            .expect.element('//span[text()="Phone number is invalid"]').to.be.visible

    },

    after: function (browser){
        browser.end();
    }
}


