let elements = {
    //Login Page Elements
    "logInButton":{
        "selector":'//li[@id="sign-in"]'
    },
    "loginEmail":{
        "selector":'//input[@id="email"]'
    },
    "loginPassword":{
        "selector":'//input[@id="password"]'
    },
    "loginSubmitButton":{
        "selector":'//input[@id="loginSubmitButton"]'
    },

    //Calendar Elements
    "addAppointment":{
        "selector":'//div[@id="genbook-add-new-calendar-button"]'
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
    "appointmentSlotMemo":{
        "selector":'//div[@class="memoSummary"]'
    },

    //Booking Form Elements
    
    //Appointment Tab
    "customerSearch":{
        "selector":'//div[@title="Customer"]/input'
    },
    email:{
        "selector":'//a[@class="booking_email"]'
    },
    phone:{
        "selector": '//span[@class="booking_phonenumber"]'
    },
    addCustomer:{
        "selector": '//a[@class="add-customer"]'
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
    "duration":{
        "selector": '//div[@title="Duration"]/input'
    },   
    memoBox:{
        "selector": '//div[@class="notes-and-memos "]'
    },
    memoTextArea:{
        "selector": '//div[@class="notes-full-view"]/textarea',
    },
    "saveButton":{
        "selector":'//div[@class="action_buttons"]/div[text()="Save"]'
    },
    "cancelAppointment":{
        "selector":'//a[@class="ui left floated  booking_cancel"]'
    },
    "confirmationYes":{
        "selector":'//div[text()="Yes"]'
    },
 

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