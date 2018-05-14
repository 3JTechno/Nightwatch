const SCREENSHOT_PATH = "./screenshots/";
var data = require('./data/testData.js');

module.exports = {
  "src_folders": "tests",
  "page_objects_path" : "pages",
  "custom_commands_path" : "commands",
  "output_folder": "./reports", // reports (test outcome) output by nightwatch
  "selenium": {
    "start_process": true, // tells nightwatch to start/stop the selenium process
    "server_path": "../selenium-server-standalone-3.8.0.jar",
    "launch_url": "http://localhost:4444/wd/hub",
    "host": "127.0.0.1",
    "port": 4444, // standard selenium ports
    "cli_args": {
      "webdriver.chrome.driver" : "node_modules/chromedriver/bin/chromedriver",
      "webdriver.gecko.driver" : "node_modules/geckodriver/bin/geckodriver", 
      "webdriver.edge.driver" : "../MicrosoftWebDriver.exe"
    }
  },
  //Whether or not to run individual test files in parallel. If set to "true", runs the tests in parallel and determines the number of workers automatically. 
  //If set to an object, can specify specify the number of workers as "auto" or a "number".
  //"test_workers" : {"enabled" : true, "workers" : "3"}, //runs tests automatically
    "test_settings": {
        "default": {
            "use_xpath": true,
            "launch_url" : "https://test1.no.genbook.com/",
            "screenshots": {
                "enabled": true, // if you want to keep screenshots
                "on_failure": true,
                "on_error": true,
                "path": SCREENSHOT_PATH // save screenshots here
            },
            "globals": {
                "waitForConditionTimeout": 10000 // sometimes internet is slow so wait.
                //"retryAssertionTimeout": 5000
            },
            "desiredCapabilities": { //  the default browser for tests
                "browserName": "chrome"
            }
        },
    // browsers configurations
        "chrome": {
            "desiredCapabilities": {
                "browserName": "chrome",
                "javascriptEnabled": true,
                "acceptSslCerts": true
            }
        },
        "firefox": {
            "desiredCapabilities": {
                "browserName": "firefox",
              //"javascriptEnabled": true,
                "marionette": true
              // "acceptSslCerts": true
            }
        },
        "safari": {
            "desiredCapabilities" : {
                "browserName" : "safari",
                "safari.options": {
                    "technologyPreview": true 
                },
                "javascriptEnabled" : true,
                "acceptSslCerts" : true
            }
        }
    },
    "request_timeout_options": {
        "timeout": 200000
    }
}

function padLeft (count) { // theregister.co.uk/2016/03/23/npm_left_pad_chaos/
  return count < 10 ? '0' + count : count.toString();
}

var FILECOUNT = 0; // "global" screenshot file count
/**
 * The default is to save screenshots to the root of your project even though
 * there is a screenshots path in the config object above! ... so we need a
 * function that returns the correct path for storing our screenshots.
 * While we're at it, we are adding some meta-data to the filename, specifically
 * the Platform/Browser where the test was run and the test (file) name.
 */
function imgpath (browser) {
  var a = browser.options.desiredCapabilities;
  var meta = [a.platform];
  meta.push(a.browserName ? a.browserName : 'any');
  meta.push(a.version ? a.version : 'any');
  meta.push(a.name); // this is the test filename so always exists.
  var metadata = meta.join('~').toLowerCase().replace(/ /g, '');
  return SCREENSHOT_PATH + metadata + '_' + padLeft(FILECOUNT++) + '_';
}

module.exports.imgpath = imgpath;
module.exports.SCREENSHOT_PATH = SCREENSHOT_PATH;
