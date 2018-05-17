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
    setupAssistantCloseBtn:{
        selector: '//div[@class="close-setup-box"]/img'
    },
    addAppointment:{
        selector:'//div[@id="genbook-add-new-calendar-button"]'
    },
    weekView:{
        selector:'//div[@id="resource_ + merchant.staff1Id + "]/div[@class="calheaderWrapper"]/div[@class="calselect"]/div[2]'
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