# integration-tests

This is a sample project for integration tests using Selenium and Cucumber

## Intro

The tests are written with Gherkin with a `.feature` extension. There are some samples available under `functional/features`

The steps are defined in `step_definitions/generic.js`

The selenium translation from Gherkin is done in `support/helper.js` 

## Instructions

### Dependencies

Note that if you plan on using browserstack or a similar service you don't need chromedriver nor Java as this is managed by those services. 
You will however need the `jq` command line tool. If you're a brew user just run `brew install jq`

### Node

Nodejs is required. Please install one if you don't have one already. The .nvmrc stores which version should be used.

### Chromedriver

This requires [chromedriver](https://chromedriver.chromium.org/downloads) to either be on the system path or the local folder.

Make sure the version of chromedriver matches your version of Chrome :) 

For other browsers like firefox get the appropriate driver (Firefox's driver is geckodriver which is available [here](https://github.com/mozilla/geckodriver/releases)).

### Java

You need to have a local installation of Java since the local Selenium server depends on it to be able to execute.

## Running

### Setup

#### 1 - Install the node dependencies
Make sure you have yarn installed on the node version you're running. You can install it by running `npm install -g yarn`

Then install the dependencies by exevuting
`yarn`

#### 2 - Launch the selenium server
`java -jar selenium-server-standalone-3.11.0.jar`
or 
`yarn start_selenium` to start the selenium server and `yarn stop_selenium` to stop it.

### Local execution

`yarn staging` will run the tests against the staging environment.

### Running on browserstack

This example will run on latest Edge browser on a windows 10 machine: 

`yarn browserstack_staging_win10_edge`

### More

To get a full list of options for browserstack consult the capabilities page [here](https://www.browserstack.com/automate/capabilities)
