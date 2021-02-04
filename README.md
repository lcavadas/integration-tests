# integration-tests

This is a sample project for integration tests using Selenium and Cucumber

## Intro

The tests are written with Gherkin with a `.feature` extension. There is a sample available under `functional/features`

The steps are defined in `functional/step_definitions/generic.js`

The selenium translation from Gherkin is done in `functional/support/helper.js` 

## Instructions

### Dependencies

Note that if you plan on using browserstack or a similar service you don't need chromedriver nor Java as this is managed by those services.

### Node

Nodejs is required. Please install one if you don't have one already

### Chromedriver

This requires [chromedriver](https://chromedriver.chromium.org/downloads) to either be on the system path or the local folder.

Make sure the version of chromedriver matches your version of Chrome :) 

For other browsers like firefox get the appropriate driver (Firefox's driver is geckodriver which is available [here](https://github.com/mozilla/geckodriver/releases)).

### Java

You need to have a local installation of Java since the local Selenium server depends on it to be able to execute.

## Running

### Setup

#### 1 - Install the node dependencies
`npm install`

#### 2 - Launch the selenium server
`java -jar selenium-server-standalone-3.11.0.jar`

#### 3 - Run the tests
`node_modules/gulp/bin/gulp.js functional`

### More

To get a full list of options run:

`node_modules/gulp/bin/gulp.js functional --options`
