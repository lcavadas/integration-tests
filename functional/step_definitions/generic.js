/*globals require:true, module:true, console:true*/
var helper = require("../support/helper");
var {defineSupportCode} = require('cucumber');
var JsonFormatter = require('cucumber').JsonFormatter;
var fs = require('fs');

defineSupportCode(function ({setWorldConstructor, When, Before, After}) {

  setWorldConstructor(function () {
    this.driver = helper.init();
  });

  Before(function (testCase, next) {
    //   // helper.resetFunctionalData(next);
    next();
  });

  After(function () {
    return this.driver.quit();
  });

  When(/^I navigate to '(.*)'$/, {timeout: 60000}, helper.goTo);

  When(/^I enter '(.*)' into '(.*)'/, helper.sendToInput);

  When(/^I click '(.*)'$/, {timeout: 10000}, helper.clickElement);

  When(/^I hover over '(.*)'$/, helper.hoverElement);

  When(/^I should see '(.*)'$/, helper.checkVisible);

  When(/^I should see a number for '(.*)'$/, helper.checkForNumber);

  When(/^I should not see '(.*)'$/, helper.checkInvisible);

  When(/^I should see notification with '(.*)'$/, helper.assertNotificationMessage);

  When(/^I should see (\d+) '(.*)'$/, helper.countElements);

  When(/^I hit '(.*)' on '(.*)'$/, helper.sendKeyToInput);

  When(/^I wait for the page to load$/, {timeout: 60000}, helper.waitForLoadingReady);

  When(/^I wait for '(.*)' to go way$/, {timeout: 60000}, helper.waitForReady);

  When(/^I should see the text '(.*)' in '(.*)'$/, helper.assertText);

  When(/^I should see the value '(.*)' in '(.*)'$/, helper.assertValue);

  When(/^I should see a '(.*)' with the text '(.*)'$/, helper.assertAnyElementText);

  When(/^I login with '(.*)' '(.*)'$/, function (username, password, next) {
    helper.sendToInput(username, '.username', function () {
      helper.sendToInput(password, '.password', function () {
        helper.clickElement('.login-btn', function () {
          helper.waitForReady('.progess-bar', next);
        })
      });
    });
  });
});