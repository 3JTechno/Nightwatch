var moment = require('moment')
var momentTimezone = require('moment-timezone')
var merchantData = require('./data/merchantSettings').nightwatchTest1

module.exports={

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
