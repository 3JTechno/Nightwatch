let elements = {

    customerSearch:{
        selector:'//div[@title="Customer"]/input'
    },
    email:{
        selector:'//a[@class="booking_email"]'
    },
    phone:{
        selector: '//span[@class="booking_phonenumber"]'
    },
    addCustomer:{
        selector: '//a[@class="add-customer"]'
    },
    serviceDropDown:{
        selector:'//div[@title="Service"]'
    },
    staffDropDown:{
        selector:'//div[@title="Staff"]'
    },
    dateDropDown:{
        selector:'//div[@class="react-datepicker__input-container"]/input'
    },
    timeDropDown:{
        selector: '//div[@title="Time"]/div[@class="default text"]'
    },
    duration:{
        selector: '//div[@title="Duration"]/input'
    },   
    memoBox:{
        selector: '//div[@class="notes-and-memos "]'
    },
    memoTextArea:{
        selector: '//div[@class="notes-full-view"]/textarea',
    },
    saveButton:{
        selector:'//div[@class="action_buttons"]/div[text()="Save"]'
    },
    cancelAppointment:{
        selector:'//a[@class="ui left floated  booking_cancel"]'
    },
    cancelAppointmentConfirmation:{
        'selector': '//div[@class="save-box "]/section[@class="header"]'
    },
    confirmationYes:{
        selector:'//div[text()="Yes"]'
    },
    closeBtn:{
        selector: '//button[@class="close_button2"]'
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