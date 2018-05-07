let elements = {
    "logInButton":{
        "selector":'//li[@id="sign-in"]'
    },
    "email":{
        "selector":'//input[@id="email"]'
    },
    "password":{
        "selector":'//input[@id="password"]'
    },
    "loginSubmitButton":{
        "selector":'//input[@id="loginSubmitButton"]'
    },
    "customerSearch":{
        "selector":'//div[@title="Customer"]/input'
    },
    "addAppointment":{
        "selector":'//div[@id="genbook-add-new-calendar-button"]'
    },
    "serviceDropDown":{
        "selector":'//div[@title="Service"]'
    },
    "staffDropDown":{
        "selector":'//div[@title="Staff"]'
    },
    "dateDropDown":{
        "selector":'//div[@class="react-datepicker__input-container"]/input'
    },
    "timeDropDown":{
        "selector": '//div[@title="Time"]/div[@class="default text"]'
    },
    "saveButton":{
        "selector":'//div[@class="action_buttons"]/div[text()="Save"]'
    },
    "appointmentSlotName":{
        "selector":'//div[@class="nameSummary"]/div[@class="namePhone"]/span/span'
    },
    "appointmentSlotService":{
        "selector":'//div[@class="nameSummary"]/div[@class="service"]'
    },
    "appointmentSlotPhone":{
        "selector":'//div[@class="nameSummary"]/div[@class="phone"]'
    },
    "cancelAppointment":{
        "selector":'//a[@class="ui left floated  booking_cancel disabled"]'
    },
    "confirmationYes":{
        "selector":'//div[text()="Yes"]'
    }
}
    

for (key in elements){
    if (elements.hasOwnProperty(key)){
        elements[key].locateStrategy = "xpath";
    }
}

module.exports = {
  url:"",
  elements: elements
};