/*globals require:true, process:true, console:true */
const webDriver = require('selenium-webdriver');
const percySnapshot = require('@percy/selenium-webdriver');
const selectorMapping = require('./aliases.js');
const fs = require("fs");

let driver;
let baseUrl;
let seleniumServerAddress;

let capabilities = {
  resolution: '1280x1024',
  project: 'Frontend',
  browserName: 'chrome'
};

module.exports = {
  capabilities,
  init: (worldConfig) => {
    baseUrl = worldConfig.baseUrl || 'https://frontend-stg.vercel.app';
    delete worldConfig.baseUrl;
    seleniumServerAddress = worldConfig.seleniumServerAddress || 'http://localhost:4444/wd/hub';
    delete worldConfig.seleniumServerAddress;

    Object.keys(worldConfig).forEach((arg) => {
      capabilities[arg] = worldConfig[arg];
    });

    capabilities.build = `${capabilities.commit} on ${capabilities.os}: ${capabilities.os_version} - ${capabilities.browser}: ${capabilities.browser_version}`
  },
  getDriver: () => {
    let builder = new webDriver.Builder()
      .usingServer(seleniumServerAddress)
      .withCapabilities(capabilities);

    if (capabilities.headless) {
      if (capabilities.browserName === 'chrome') {
        const chrome = require('selenium-webdriver/chrome');
        let options = new chrome.Options();
        options.headless();
        builder.setChromeOptions(options);
      } else if (capabilities.browserName === 'firefox') {
        const firefox = require('selenium-webdriver/firefox');
        let options = new firefox.Options();
        options.headless();
        builder.setFirefoxOptions(options);
      }
    }

    driver = builder.build();

    if (capabilities.resolution.length) {
      let dimension = capabilities.resolution.split('x');
      driver.manage().window().setSize(+dimension[0], +dimension[1]);
    }

    return driver;
  },
  resetFunctionalData: (next) => {
    next();
  },
  getSelectorMapping: (description) => {
    return selectorMapping[description] || description;
  },
  waitForReady: (selector, next) => {
    driver.sleep(2500);
    if (!next) {
      next = selector;
      selector = '.loading';
    }
    // console.log('Waiting for ', selector, ' to go away');
    driver.wait(function () {
      return driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
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
    }, 360000);
  },
  waitForLoadingReady: (next) => {
    let selector = next;
    let next1;
    driver.sleep(2500);
    if (!next1) {
      next1 = selector;
      selector = '.loading';
    }
    // console.log('Waiting for ', selector, ' to go away');
    driver.wait(function () {
      return driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
        return el.isDisplayed().then(function (displayed) {
          if (!displayed) {
            // console.log('Loading is complete');
            driver.sleep(100).then(next1);
            return true;
          }
        }, function () {
          // console.log('Loading is complete');
          driver.sleep(100).then(next1);
          return true;
        });
      }, function () {
        // console.log('Loading is complete');
        driver.sleep(100).then(next1);
        return true;
      });
    }, 360000);
  },
  waitForElement: (selector, next) => {
    driver.sleep(100);
    driver.wait(function () {
      return driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
        return el.isDisplayed().then(function (displayed) {
          if (displayed) {
            // console.log('Loading is complete');
            driver.sleep(100).then(next);
            return true;
          }
        }, function () {
          driver.sleep(100)
          return false;
        });
      }, function () {
        driver.sleep(100)
        return false;
      });
    }, 360000);
  },
  sendToInput: (text, selector, next) => {
    let realSelector = module.exports.getSelectorMapping(selector);
    if (realSelector.indexOf('iframe') !== -1) {
      let parts = realSelector.split('iframe');
      let frame = parts.splice(0, 1)[0] + 'iframe';
      let remainder = parts.join('iframe');
      driver.findElement(webDriver.By.css(frame)).then(function (iframe) {
        driver.switchTo().frame(iframe).then(() => module.exports.sendToInput(text, remainder, () => {
          driver.switchTo().defaultContent().then(next);
        }));
      })
    }
    // console.log('Typing "' + text + '" into "' + selector + '"');
    driver.findElement(webDriver.By.css(realSelector)).then(function (element) {
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
  },
  sendToInputSlow: (text, selector, next) => {
    let realSelector = module.exports.getSelectorMapping(selector);
    if (realSelector.indexOf('iframe') !== -1) {
      let parts = realSelector.split('iframe');
      let frame = parts.splice(0, 1)[0] + 'iframe';
      let remainder = parts.join('iframe');
      driver.findElement(webDriver.By.css(frame)).then(function (iframe) {
        driver.switchTo().frame(iframe).then(() => module.exports.sendToInputSlow(text, remainder, () => {
          driver.switchTo().defaultContent().then(next);
        }));
      })
    }
    // console.log('Typing "' + text + '" into "' + selector + '"');
    driver.findElement(webDriver.By.css(realSelector)).then(function (element) {
      // console.log('\tElement found, typing "' + text + '"');
      element.clear().then(function () {
        let pos = 0;
        let sendCharacter = () => {
          element.sendKeys(text[pos]).then(function () {
            pos++;
            if (pos < text.length) {
              driver.sleep(200);
              sendCharacter();
            } else {
              // console.log('\tTyping done');
              next();
            }
          }, function () {
            next(new Error('Failed to send "' + text + '" to "' + selector + '"'));
          });
        }
        sendCharacter();
      });
    }, function () {
      next(new Error('Element "' + selector + '" was not found'));
    });
  },
  sendKeyToInput: (key, selector, next) => {
    // console.log('Sending "' + key + '" into "' + selector + '"');
    driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (element) {
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
  },
  clickElement: (selector, next) => {
    // console.log('Clicking ' + selector);
    let clickIt = function (el, retry) {
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

    driver.findElements(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (els) {
      for (let i = 0; i < els.length; i++) {
        let el = els[i];
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
  },
  hoverElement: (selector, next) => {
    // console.log('Hovering over ' + selector);

    let hoverIt = function (el) {
      driver.actions().mouseMove(el).perform().then(function () {
        driver.sleep(100).then(next);
      });
    };

    driver.findElements(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (els) {
      for (let i = 0; i < els.length; i++) {
        let el = els[i];
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
  },
  checkVisible: (selector, next) => {
    // console.log('Checking visibility of "' + selector + '"');
    driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
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
  },
  checkInvisible: (selector, next) => {
    // console.log('Checking invisibility of "' + selector + '"');
    driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
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
  },
  goTo: (site, next) => {
    let url = site.startsWith('http') ? site : baseUrl + (site || '');

    // console.log('Navigating to', url);
    driver.get(url).then(function () {
      let selector = next;
      let next1;
      driver.sleep(2500);
      if (!next1) {
        next1 = selector;
        selector = '.loading';
      }
      // console.log('Waiting for ', selector, ' to go away');
      driver.wait(function () {
        return driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
          return el.isDisplayed().then(function (displayed) {
            if (!displayed) {
              // console.log('Loading is complete');
              driver.sleep(100).then(next1);
              return true;
            }
          }, function () {
            // console.log('Loading is complete');
            driver.sleep(100).then(next1);
            return true;
          });
        }, function () {
          // console.log('Loading is complete');
          driver.sleep(100).then(next1);
          return true;
        });
      }, 360000);
    });
  },
  nil: () => {
  },
  checkForNumber: (selector, next) => {
    // console.log('Checking if "' + selector + '" is a number');
    driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
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
  },
  assertNotificationMessage: (message, next) => {
    return module.exports.assertText(message, '.MuiSnackbar-root .MuiAlert-message', next);
  },
  countElements: (count, selector, next) => {
    // console.log('Checking the number of "' + selector + '" is ' + count);
    driver.findElements(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (els) {
      if (+count === els.length) {
        next();
      } else {
        next('Expected to find ' + count + ' but found ' + els.length + ' for "' + module.exports.getSelectorMapping(selector) + '"');
      }
    });
  },
  assertText: (text, selector, next) => {
    text = text.replace(/\$baseUrl/, baseUrl);
    // console.log('Checking if "' + selector + '" has text "' + text + '"');
    driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
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
  },
  assertAnyElementText: (selector, text, next) => {
    text = text.replace(/\$baseUrl/, baseUrl);
    // console.log('Checking if any "' + selector + '" has text "' + text + '"');
    driver.findElements(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (els) {
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
  },
  assertValue: (text, selector, next) => {
    // console.log('Checking if input "' + selector + '" has text "' + text + '"');
    driver.findElement(webDriver.By.css(module.exports.getSelectorMapping(selector))).then(function (el) {
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
  },
  debugger: () => {
    console.log('debugger');
  },
  snapshot: (title, next) => {
    if (process.env.PERCY_TOKEN) {
      percySnapshot(driver, title).then(next).catch(driver.takeScreenshot());
    } else {
      driver.takeScreenshot().then((image) => {
        fs.mkdir('tmp', {recursive: true}, () => {
          fs.writeFile(`tmp/${title.replace(/ /g, '_')}.png`, image, 'base64', next);
        });
      });
    }
  }
};
