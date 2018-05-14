var moment = require('moment')
var momentTimezone = require('moment-timezone')

module.exports={

    'login': function(browser, username, password){

        //Login to booking manager

        browser.url(browser.launchUrl);

        var appointmentTab = browser.page.pageObject()

        appointmentTab
            .waitAndClick('@logInButton', browser)
            .waitAndClick('@loginEmail', browser)
            .setValue('@loginEmail', username)
            .clearValue('@loginPassword')
            .setValue('@loginPassword', password)
            .click('@loginSubmitButton')
        this.switch_iframe("calendar", browser)

    },

    'find_slotId': function(start, customerId, timezone){

        //Translate time into slot format
        let hour = moment(start, "HH:mma").get("hour")
        let min = moment(start, "HH:mma").get("minute")
        let todayDate = momentTimezone.tz(timezone)
        if(moment(todayDate).day() != "SUN" ? dayOfTheWeek = moment(todayDate).weekday() + 1 : dayOfTheWeek = 1)

        return "tsE" + dayOfTheWeek + "H" + hour + "m" + min + "s0_PT30M_" + customerId
    },
    
    'find_day_number': function(){

        //Convert today's day to numeric (Mon = 2, Tue = 3...)

        let todayDate = momentTimezone.tz(merchantData.timezone)
        if(moment(todayDate).day() != "SUN" ? dayOfTheWeek = moment(todayDate).weekday() + 1 : dayOfTheWeek = 1)

        return dayOfTheWeek
    },

    'switch_iframe': function(frame, browser){

        //Switch between calendar iframe  and booking form iframe
        if(frame == "bookingForm"){
            browser
                .frameParent()
                .waitForElementVisible("//iframe[@id='booking_frame']")
                .frame("booking_frame")
        }else if(frame == "calendar"){
            browser
                .frameParent()
                .waitForElementVisible("//iframe[@id='ps-group-day']")
                .frame("ps-group-day")
        }
    },

    'generate_unique_id': function(){

        //Create an unique id

        let today = new Date()
        return today.getTime() // we use time from 1970 to always get a unique id
    }
}
