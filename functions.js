var moment = require('moment')
var momentTimezone = require('moment-timezone')

module.exports={

    'login': function(browser, username, password){

        //Login to booking manager
        browser.url(browser.launchUrl);

        var calendar = browser.page.calendar()

        calendar
            .waitAndClick('@logInButton')
            .waitAndClick('@loginEmail')
            .setValue('@loginEmail', username)
            .clearValue('@loginPassword')
            .setValue('@loginPassword', password)
            .click('@loginSubmitButton')
            .waitAndClick('@setupAssistantCloseBtn') //here we are closing the setup assistant pop down which overlay on the calendar and can cause element to not be visible :-(
            .switchFrame('calendar-day-view')

    },

    'clear_appointments': function(browser){

        //Function used to clear all existing appointment currently present on the calendar.
        //This allows to ensure a test always start with a clear calendar (in case a previous test fails and leave undeleted appointment).

        let listElement = []
        let listId = []

        browser
            .elements('xpath', '//body/div', function(result){
                listElement = result.value
            })
            .perform(function(done){
                listElement.forEach(function (element){
                    browser.elementIdAttribute(element.ELEMENT, 'id', function(id){
                        if(id.value.substring(0, 3) == "167"){
                            listId.push(id.value)
                        }
                    })
                })
                done()
            })
            .perform((done) => { //The arrow function allow to not create a context so "this" will still refer to the main object so all the functions listed in this object are accessible (i.e."delete_appointment").
                if(listId.length > 0){
                    console.log('Found ' + listId.length + ' appointments...deletion in progress')
                    listId.forEach((element) => {
                        this.delete_appointment(browser, '//div[@id="' + element + '"]')
                    })    
                }
                done()
            })
    },

    'delete_appointment': function(browser, xpath){

        //Use xpath to delete a appointment on the calendar
        
        let calendar = browser.page.calendar()
        let appointmentTab = browser.page.appointmentTab()

        calendar
            .moveToElement(xpath,10 ,10)
            .waitForElementVisible(xpath)
            .click(xpath)
            .switchFrame('bookingForm')
        appointmentTab
            .waitAndClick('@cancelAppointment')
            .waitAndClick('@confirmationYes')
            .switchFrame('calendar-day-view')
        calendar.expect.element(xpath).to.not.be.present
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

    'generate_unique_id': function(){

        //Create an unique id
        let today = new Date()
        return today.getTime() // we use time from 1970 to always get a unique id
    },

    'capitalize_first_letter': function(word){

        //Transform first letter of a word in capital letter
        return word.replace(/\b\w/g, l => l.toUpperCase());
    },

    'add_note': function(note, appointmentTab){

        //Add a note to the booking form
        appointmentTab
            .waitAndClick('@memoBox')
            .waitForElementVisible('@memoTextArea')
            .clearValue('@memoTextArea')
            .setValue('@memoTextArea', note)
            .expect.element('@memoTextArea').text.to.equal(note)
    }
}
