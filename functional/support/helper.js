/*globals require:true, process:true, console:true */
var webDriver = require('selenium-webdriver');
var driver;
var baseUrl;
var seleniumServerAddress;
var basePath;
var capabilities = {
  resolution: '1280x1024',
  project: 'infinity-web',
  build: 'functional-tests',
  name: '' + new Date(),
  browserName: 'chrome'
};

var selectorMapping = {};

var _getSelectorMapping = function (description) {
  return selectorMapping[description] || description;
};

var _getDriver = function () {
  driver = new webDriver.Builder()
    .usingServer(seleniumServerAddress)
    .withCapabilities(capabilities)
    .build();

  var dimension = capabilities.resolution.split('x');
  driver.manage().window().setSize(+dimension[0], +dimension[1]);
  return driver;
};

var _sendToInput = function (text, selector, next) {
  // console.log('Typing "' + text + '" into "' + selector + '"');
  driver.findElement(webDriver.By.css(_getSelectorMapping(selector))).then(function (element) {
    // console.log('\tElement found, typing "' + text + '"');
    element.clear().then(function () {
      element.sendKeys(text).then(function () {
        // console.log('\tTyping done');
        next();
      }, function () {
        next(new Error('Failed to send "' + text + '" to "' + selector + '"'));
      });
    });
  }, function () {
    next(new Error('Element "' + selector + '" was not found'));
  });
};

var _sendKeyToInput = function (key, selector, next) {
  // console.log('Sending "' + key + '" into "' + selector + '"');
  driver.findElement(webDriver.By.css(_getSelectorMapping(selector))).then(function (element) {
    // console.log('\tElement found, sending "' + key + '"');
    element.sendKeys(webDriver.Key[key]).then(function () {
      // console.log('\tTyping done');
      next();
    }, function () {
      next(new Error('Failed to send "' + key + '" to "' + selector + '"'));
    });
  }, function () {
    next(new Error('Element "' + selector + '" was not found'));
  });
};

var _clickElement = function (selector, next) {
  // console.log('Clicking ' + selector);
  var clickIt = function (el, retry) {
    if (retry) {
      driver.executeScript("arguments[0].scrollIntoView(true)", el).then(function () {
        // console.log('Scrolled element into view');
      }, function () {
        //assuming that if the element is gone the action already produces the intended results
        driver.sleep(100).then(next);
      });
    } else {
      driver.sleep(100);
    }

    try {
      el.click().then(function () {
        driver.sleep(100).then(next);
      }, function (e) {
        if (!retry) {
          clickIt(el, true);
        } else {
          throw e;
        }
      });
    } catch (e) {
      //stale element so assume the action has succeeded
      driver.sleep(100).then(next);
    }
  };

  driver.findElements(webDriver.By.css(_getSelectorMapping(selector))).then(function (els) {
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      // console.log('Found ' + els.length + ' elements');
      (function (elementToClick) {
        elementToClick.isDisplayed().then(function (visible) {
          if (visible) {
            clickIt(elementToClick);
          }
        });
      })(el);
    }
  });
};

var _hoverElement = function (selector, next) {
  // console.log('Hovering over ' + selector);

  var hoverIt = function (el) {
    driver.actions().mouseMove(el).perform().then(function () {
      driver.sleep(100).then(next);
    });
  };

  driver.findElements(webDriver.By.css(_getSelectorMapping(selector))).then(function (els) {
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      // console.log('Found ' + els.length + ' elements');
      (function (elementToHoverOver) {
        elementToHoverOver.isDisplayed().then(function (visible) {
          if (visible) {
            hoverIt(elementToHoverOver);
          }
        });
      })(el);
    }
  });
};

var _checkVisible = function (selector, next) {
  // console.log('Checking visibility of "' + selector + '"');
  driver.findElement(webDriver.By.css(_getSelectorMapping(selector))).then(function (el) {
    el.isDisplayed().then(function (displayed) {
      if (displayed) {
        // console.log('\tElement "' + selector + '" is visible');
        next();
      } else {
        next(new Error('Element "' + selector + '" is not visible'));
      }
    });
  }, function () {
    next(new Error('Element "' + selector + '" not found'));
  });
};

var _checkInvisible = function (selector, next) {
  // console.log('Checking invisibility of "' + selector + '"');
  driver.findElement(webDriver.By.css(_getSelectorMapping(selector))).then(function (el) {
    el.isDisplayed().then(function (displayed) {
      if (!displayed) {
        // console.log('\tElement "' + selector + '" is invisible');
        next();
      } else {
        next(new Error('Element "' + selector + '" is visible'));
      }
    });
  }, function () {
    // console.log('\tElement "' + selector + '" not found');
    next();
  });
};

var _countElements = function (count, selector, next) {
  // console.log('Checking the number of "' + selector + '" is ' + count);
  driver.findElements(webDriver.By.css(_getSelectorMapping(selector))).then(function (els) {
    if (+count === els.length) {
      next();
    } else {
      next('Expected to find ' + count + ' but found ' + els.length + ' for "' + _getSelectorMapping(selector) + '"');
    }
  });
};

var _checkForNumber = function (selector, next) {
  // console.log('Checking if "' + selector + '" is a number');
  driver.findElement(webDriver.By.css(_getSelectorMapping(selector))).then(function (el) {
    el.getText().then(function (val) {
      if (!Number.isNaN(parseInt(val, 10))) {
        // console.log('\tValue is a number');
        next();
      } else {
        next(new Error('Value of "' + selector + '" is not a number'));
      }
    });
  }, function () {
    next(new Error('Element "' + selector + '" not found'));
  });
};

var _waitForReady = function (selector, next) {
  driver.sleep(2500);
  if (!next) {
    next = selector;
    selector = '.loading';
  }
  // console.log('Waiting for ', selector, ' to go away');
  driver.wait(function () {
    return driver.findElement(webDriver.By.css(_getSelectorMapping(selector))).then(function (el) {
      return el.isDisplayed().then(function (displayed) {
        if (!displayed) {
          // console.log('Loading is complete');
          driver.sleep(100).then(next);
          return true;
        }
      }, function () {
        // console.log('Loading is complete');
        driver.sleep(100).then(next);
        return true;
      });
    }, function () {
      // console.log('Loading is complete');
      driver.sleep(100).then(next);
      return true;
    });
  }, 60000);
};

var _waitForLoadingReady = function (next) {
  _waitForReady(next);
};

var _goTo = function (site, next) {
  var url = baseUrl + (site || '');

  // console.log('Navigating to', url);
  driver.get(url).then(function () {
    _waitForReady(next);
  });
};

var _nil = function () {
};

var _assertNotificationMessage = function (message, next) {
  // console.log('NOT IMPLEMENTED: Looking for notification message ' + message);
  next(new Error('This functionality is not implemented yet'));
};

var _assertText = function (text, selector, next) {
  text = text.replace(/\$baseUrl/, baseUrl);
  // console.log('Checking if "' + selector + '" has text "' + text + '"');
  driver.findElement(webDriver.By.css(_getSelectorMapping(selector))).then(function (el) {
    // console.log('Element "' + selector + '" found');
    el.getText().then(function (actual) {
      if (actual === text) {
        // console.log('Element "' + selector + '" has expected text "' + text + '"');
        next();
      } else {
        next(new Error('Text is "' + actual + '" but expected "' + text + '"'));
      }
    });
  }, function () {
    // console.log('Element "' + selector + '" not found');
    next(new Error('Unable to find element "' + selector + '"'));
  });
};

var _assertAnyElementText = function (selector, text, next) {
  text = text.replace(/\$baseUrl/, baseUrl);
  // console.log('Checking if any "' + selector + '" has text "' + text + '"');
  driver.findElements(webDriver.By.css(_getSelectorMapping(selector))).then(function (els) {
    // console.log('Elements "' + selector + '" found');
    els.forEach(function (el) {
      el.getText().then(function (actual) {
        if (actual === text) {
          // console.log('Found element with expected text "' + text + '"');
          next();
        } else {
          console.log('Text is "' + actual + '" but expected "' + text + '"');
        }
      });
    });
  }, function () {
    // console.log('Element "' + selector + '" not found');
    next(new Error('Unable to find element "' + selector + '"'));
  });
};

var _assertValue = function (text, selector, next) {
  // console.log('Checking if input "' + selector + '" has text "' + text + '"');
  driver.findElement(webDriver.By.css(_getSelectorMapping(selector))).then(function (el) {
    // console.log('Element "' + selector + '" found');
    el.getAttribute('value').then(function (actual) {
      if (actual === text) {
        // console.log('Element "' + selector + '" has expected text "' + text + '"');
        next();
      } else {
        next(new Error('Text is "' + actual + '" but expected "' + text + '"'));
      }
    });
  }, function () {
    // console.log('Element "' + selector + '" not found');
    next(new Error('Unable to find element "' + selector + '"'));
  });
};

var _init = function () {
  process.argv.forEach(function (val) {
    if (val.indexOf('--options') === 0) {
      console.log('Options:');
      console.log('\t--file: Specify the feature file you would like to run, e.g. --file=functional/test.feature');
      console.log('\t--url: Specify the url against which to run the tests. Defaults to --url=http://dev.infinity-app.io');
      console.log('\t--path: Specify an initial path to be used in conjunction with the url as the init browser location');
      console.log('\t--reset: Specify the the path to be used to reset the functional data. [Currently disabled]');
      console.log('\t--browserName: Specify the browser to use. e.g. --browserName=chrome (default), --browserName==firefox');
      console.log('\t--[X]=[Y]: Specifies the capability [X] with value [Y] for the browser:');
      console.log('\t\t For a comprehensive list of the valid properties go to https://www.browserstack.com/automate/capabilities');

      process.exit(0);
    } else if (val.indexOf('--url') === 0) {
      baseUrl = val.substring(6);
    } else if (val.indexOf('--path') === 0) {
      basePath += val.substring(7);
    } else if (val.indexOf('--') === 0 && val.indexOf('=') > 0) {
      var parts = val.substring(2).split('=');
      capabilities[parts[0]] = parts[1];
    }
  });

  if (!baseUrl) {
    baseUrl = 'http://dev.infinity-app.io';
  }
  seleniumServerAddress = 'http://localhost:4444/wd/hub';
  return _getDriver();
};

module.exports = {
  init: _init,
  waitForReady: _waitForReady,
  waitForLoadingReady: _waitForLoadingReady,
  sendToInput: _sendToInput,
  sendKeyToInput: _sendKeyToInput,
  clickElement: _clickElement,
  hoverElement: _hoverElement,
  checkVisible: _checkVisible,
  checkInvisible: _checkInvisible,
  goTo: _goTo,
  nil: _nil,
  checkForNumber: _checkForNumber,
  assertNotificationMessage: _assertNotificationMessage,
  countElements: _countElements,
  assertText: _assertText,
  assertAnyElementText: _assertAnyElementText,
  assertValue: _assertValue
  // logout: _logout
};
