let elements = {

    firstName:{
        "selector": '//input[@name="booking_firstName"]',
    },
    lastName:{
        "selector": '//input[@name="booking_lastName"]',
    },
    email:{
        "selector": '//input[@name="booking_email"]',
    },
    phone:{
        "selector": '//input[@name="booking_phonenumber"]',
    },
    save:{
        "selector": '//div[text()="Save"]',
    },
    back:{
        "selector": '//button[@class="back-button"]'
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