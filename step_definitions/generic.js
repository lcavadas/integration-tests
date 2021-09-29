/*globals require:true, module:true, console:true*/
const helper = require("../support/helper");
const {setWorldConstructor, When, Before, After, Given} = require('cucumber');
const {capabilities} = require("../support/helper");
const fs = require("fs");

let driver;

setWorldConstructor(function (worldConfig) {
  if (!driver) {
    helper.init(worldConfig.parameters);
  }
});

Before(function (testCase, next) {
  let feature = fs.readFileSync(testCase.sourceLocation.uri).toString().split('\n').find((l => l.trim().startsWith("Feature:"))).substr(8).trim()
  capabilities.name = `${feature}: ${testCase.pickle.name}`;
  driver = helper.getDriver();
  helper.resetFunctionalData(next);
});

After(({result}) => {
  if (helper.capabilities['browserstack.local'] === false) {
    return driver.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${result.status === 'passed' ? 'passed' : 'failed'}"}}`)
      .then(() => {
        driver.sleep(1000);
        return driver.quit();
      });
  } else {
    return driver.quit();
  }
});

When(/^I navigate to '(.*?)'$/, {timeout: 60000}, helper.goTo);

When(/^I enter '(.*?)' into '(.*?)'$/, helper.sendToInput);

When(/^I enter '(.*?)' into '(.*?)' like a human$/, {timeout: 60000}, helper.sendToInputSlow);

When(/^I click '(.*?)'$/, {timeout: 10000}, helper.clickElement);

When(/^I hover over '(.*?)'$/, helper.hoverElement);

When(/^I should see '(.*?)'$/, helper.checkVisible);

When(/^I should see a number for '(.*)'$/, helper.checkForNumber);

When(/^I should not see '(.*?)'$/, helper.checkInvisible);

When(/^I should see notification with '(.*)'$/, helper.assertNotificationMessage);

When(/^I should see (\d+?) '(.*?)'$/, helper.countElements);

When(/^I hit '(.*?)' on '(.*?)'$/, helper.sendKeyToInput);

When(/^I wait for the page to load$/, {timeout: 360000}, helper.waitForLoadingReady);

When(/^I wait for '(.*?)' to go away$/, {timeout: 360000}, helper.waitForReady);

When(/^I wait for '(.*?)' to show up$/, {timeout: 360000}, helper.waitForElement);

When(/^I take a snapshot called '(.*?)'$/, helper.snapshot);

When(/^I should see the text '(.*?)' in '(.*?)'$/, helper.assertText);

When(/^I should see the value '(.*?)' in '(.*?)'$/, helper.assertValue);

When(/^I should see a '(.*?)' with the text '(.*?)'$/, helper.assertAnyElementText);

When(/^I login with '(.*?)' '(.*?)'$/, (username, password, next) => {
  helper.sendToInput(username, '.username', () => {
    helper.sendToInput(password, '.password', () => {
      helper.clickElement('.login-btn', () => {
        helper.waitForReady('.progess-bar', next);
      })
    });
  });
});

When(/^I fill in the test customer details$/, {timeout: 30000}, function (next) {
  helper.waitForElement('Customer details', () => {
    helper.sendToInput('Test', 'Customer details -> First name', () => {
      helper.sendToInput('User', 'Customer details -> Last name', () => {
        helper.sendToInput('test.user@websummit.com', 'Customer details -> Email', () => {
          helper.sendToInput('Test Street', 'Customer details -> Address', () => {
            helper.clickElement('Customer details -> Country dropdown', () => {
              helper.clickElement('Customer details -> Country dropdown -> Portugal', () => {
                helper.sendToInput('Test City', 'Customer details -> City', () => {
                  helper.sendToInput('POSTAL_TEST', 'Customer details -> Postal Code', () => {
                    next();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

When(/^I fill in the test address details$/, {timeout: 30000}, function (next) {
  helper.waitForElement('Customer details', () => {
    helper.sendToInput('Test Street', 'Customer details -> Address', () => {
      helper.clickElement('Customer details -> Country dropdown', () => {
        helper.clickElement('Customer details -> Country dropdown -> Portugal', () => {
          helper.sendToInput('Test City', 'Customer details -> City', () => {
            helper.sendToInput('POSTAL_TEST', 'Customer details -> Postal Code', () => {
              next();
            });
          });
        });
      });
    });
  });
});

Given(/^There is an order on '(.*?)' with$/, {timeout: 30000}, function (slug, table, next) {
  helper.goTo(process.env.ADMIN_URL, () => {
    driver.manage().addCookie({
      name: "auth-token",
      value: process.env.ADMIN_TOKEN,
      path: "/",
      domain: ".cilabs.net"
    }).then(() => {
      driver.navigate().refresh();
      driver.sleep(2000).then(() => {
        helper.clickElement('#select-store', () => {
          helper.clickElement(`#select-store option[data-slug="${slug}"]`, () => {
            helper.waitForElement('.panel.orders .table tr', () => {
              driver.sleep(1000);
              helper.clickElement('.panel.orders h2 .create', () => {
                helper.sendToInput('Test', '#firstName', () => {
                  helper.sendToInput('User', '#lastName', () => {
                    helper.sendToInput('test.user@websummit.com', '#email', () => {
                      helper.clickElement('#order-address', () => {
                        //table.hashes().forEach()//   { "quantity": "1", "product": "General attendee" }
                        let data = table.hashes();
                        let pos = 0;
                        let addProduct = () => {
                          helper.clickElement("#order-form .items .add-item", () => {
                            helper.sendToInput(`[name="items.${pos}.quantity"]`, data[pos].quantity, () => {
                              helper.clickElement(`[name="items.${pos}.product"] option[data-text="${data[pos].product}"]`, () => {
                                helper.clickElement('#order-form button[type="submit"]', () => {
                                  pos++;
                                  if (pos < data.length) {
                                    addProduct();
                                  } else {
                                    helper.waitForLoadingReady(next);
                                  }
                                });
                              });
                            });
                          });
                        }
                        addProduct();
                      });
                    });
                  });
                });
              });
            })
          })
        });
      });
    });
  });
});