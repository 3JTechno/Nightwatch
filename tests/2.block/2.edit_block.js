var contactDetails = require('../../data/testData').contactDetails;
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
 
    tags: ['edit_block'],
    'edit_block': function(browser){

        //Test Summary: edit a block with the booking form and verify if changes are displayed on the calendar.

        //Test data preparation
        let time1 = merchant.businessHours.startTime //first block will be created at merchant start time
        let block= functions.find_slotId(time1, merchant.staff1Id, merchant.timezone)
        let uniqueId = functions.generate_unique_id();               // we use time from 1970 to always get a unique email address
        let email = uniqueId + "@gmail.com";                         //we create dynamic email to avoid conflict with existing customer
        let note = "Unique booking Id = " + uniqueId;
        let capFirstName = functions.capitalize_first_letter(contactDetails.firstName); //Booking form capitalise the first letter of customer's names
        let capLastName = functions.capitalize_first_letter(contactDetails.lastName); //Booking form capitalise the first letter of customer's names

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
            .verify.visible('@blockText')
            // .expect.element('@blockText').to.be.visible

        //Open booking form by clicking on calendar slot
        calendar
            .waitAndClick('@blockText')
            .switchFrame('bookingForm')
            
        //Enter customer first name, last name, email, phone, memo, and save
        appointmentTab
            .click('@addCustomer');
        customerTab
            .waitForElementVisible('@firstName')
            .setValue('@firstName', contactDetails.firstName)
            .setValue('@lastName', contactDetails.lastName)
            .setValue('@email', email)
            .setValue('@phone', contactDetails.phone)
            .click('@save')
            .waitForElementVisible('//label[text()="Update customer record"]')
            .click('@back');

        //Verify correct customer is selected
        appointmentTab.expect.element('//div[@title="Customer"]/div[@class="default text"]/div').text.to.equal(capFirstName + " " + capLastName);
        appointmentTab.expect.element('@email').text.to.equals(email);
        appointmentTab.expect.element('@phone').text.to.equals(contactDetails.phone);

        //Add a note
        functions.add_note(note, appointmentTab);

        //Save appointment 
        appointmentTab.click('@saveButton');

        //Verify Appointment is displayed on the calendar
        calendar
            .switchFrame('calendar-day-view')
            .waitForElementVisible('@appointmentSlotName')
            .expect.element('@appointmentSlotName').text.to.equal(capFirstName + " " + capLastName);
        calendar.expect.element('@appointmentSlotPhone').text.to.equal(contactDetails.phone);
        calendar.expect.element('@appointmentSlotMemo').text.to.equal('"' + note + '"'); //Calendar displays memo between quotes
    },

    after: function (browser){
        functions.clear_appointments(browser)
        browser.end();
    }
}