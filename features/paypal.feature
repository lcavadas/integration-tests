Feature: Paypal

  Scenario: Can purchase
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I wait for 'Customer details' to show up
    And I enter 'Luis' into 'Customer details -> First name'
    And I enter 'Serralheiro' into 'Customer details -> Last name'
    And I enter 'luis.serralheiro@websummit.com' into 'Customer details -> Email'
    And I enter 'Rua whatever' into 'Customer details -> Address'
    And I click 'Customer details -> Country dropdown'
    And I click 'Customer details -> Country dropdown -> Portugal'
    And I enter 'Coimbra' into 'Customer details -> City'
    And I enter '3030' into 'Customer details -> Postal Code'
    And I click 'Payment -> Pay with paypal'
    And I click 'Payment -> Accept T&Cs'
    And I take a snapshot called 'Pay with Paypal'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Paypal -> Username' to show up
    And I enter 'sb-kvxwl3520988@personal.example.com' into 'Paypal -> Username'
    And I wait for 'Paypal -> Accept Cookies' to show up
    And I click 'Paypal -> Accept Cookies'
    And I click 'Paypal -> Next'
    And I wait for 'Paypal -> Password' to show up
    And I enter 'c_KW6jM&' into 'Paypal -> Password'
    And I click 'Paypal -> Login'
    And I wait for 'Paypal -> Loading' to go away
    And I click 'Paypal -> Confirm Payment'
    And I wait for 'Payment Loader' to go away
    And I wait for 'Success page' to show up
    Then I should see 'Success page'
