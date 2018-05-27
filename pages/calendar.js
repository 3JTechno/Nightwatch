var util = require('util');

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
        selector:'//div[@id="company-add-new-calendar-button"]'
    },
    weekView:{
        selector:'//div[@id="resource_ + merchant.staff1Id + "]/div[@class="calheaderWrapper"]/div[@class="calselect"]/div[2]'
    },
    blockText:{ //Text that is displayed on a block appointment
        selector: '//div[@class="heldtext"][text()="Blocked"]' 
    },
    blockBtn:{ //Small button that appears when hovering on a calendar slot
        selector: '//img[@id="bt_block"]'
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
    slot: {
        selector: '//div[@id="%s"]'
    }
}

for (key in elements){
    if (elements.hasOwnProperty(key)){
        elements[key].locateStrategy = "xpath";
    }
}

module.exports = {
  url:"",
  elements: elements,
  commands: [
    {
    //This function allows to inject a dynamic variable into a fixe selector
      el: function (locator, variable) {
        element = this.elements[locator.slice(1)].selector
        return util.format(element, variable)
      }
    }
  ],
};