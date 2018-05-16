let elements = {
    //Login Page Elements
    logInButton:{
        selector:'//li[@id="sign-in"]'
    },
    loginEmail:{
        selector:'//input[@id="email"]'
    },
    loginPassword:{
        selector:'//input[@id="password"]'
    },
    loginSubmitButton:{
        selector:'//input[@id="loginSubmitButton"]'
    },

    //Calendar Elements
    addAppointment:{
        selector:'//div[@id="genbook-add-new-calendar-button"]'
    },
    appointmentSlotName:{
        selector:'//div[@class="nameSummary"]/div[@class="namePhone"]/span/span'
    },
    appointmentSlotService:{
        selector:'//div[@class="nameSummary"]/div[@class="service"]'
    },
    appointmentSlotPhone:{
        selector:'//div[@class="nameSummary"]/div[@class="phone"]'
    },
    appointmentSlotMemo:{
        selector:'//div[@class="memoSummary"]'
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