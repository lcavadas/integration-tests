Feature: Stripe

  Scenario: Can purchase
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I take a snapshot called 'Sales Page'
    And I click 'GA - Book Me'
    And I wait for 'Customer details' to show up
    And I take a snapshot called 'Customer details'
    And I enter 'Luis' into 'Customer details -> First name'
    And I enter 'Serralheiro' into 'Customer details -> Last name'
    And I enter 'luis.serralheiro@websummit.com' into 'Customer details -> Email'
    And I enter 'Rua whatever' into 'Customer details -> Address'
    And I click 'Customer details -> Country dropdown'
    And I click 'Customer details -> Country dropdown -> Portugal'
    And I enter 'Coimbra' into 'Customer details -> City'
    And I enter '3030' into 'Customer details -> Postal Code'
    And I click 'Payment -> Pay with stripe'
    And I enter '4242424242424242' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    And I take a snapshot called 'Stripe: Pay with Stripe'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    And I wait for 'Success page' to show up
    Then I should see 'Success page'

  Scenario: Failed payment with declined with card_declined
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    And I enter '4000000000000002' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    Then I wait for 'Notification' to show up
    And I should see notification with 'Your card was declined.'
    And I take a snapshot called 'Stripe: Failed payment with declined with card_declined'

  Scenario: Failed payment with declined with cvc_check
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    And I enter '4000000000000101' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    Then I wait for 'Notification' to show up
    And I should see notification with 'Your card's security code is incorrect.'
    And I take a snapshot called 'Stripe: Failed payment with declined with cvc_check'

  Scenario: Failed payment with declined with insufficient_funds
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    And I enter '4000000000009995' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    Then I wait for 'Notification' to show up
    And I should see notification with 'Your card has insufficient funds.'
    And I take a snapshot called 'Stripe: Failed payment with declined with insufficient_funds'

  Scenario: Failed payment with declined with lost_card
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    And I enter '4000000000009987' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    Then I wait for 'Notification' to show up
    And I should see notification with 'Your card has been declined.'
    And I take a snapshot called 'Stripe: Failed payment with declined with lost_card'

  Scenario: Failed payment with declined with stolen_card
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    And I enter '4000000000009979' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    Then I wait for 'Notification' to show up
    And I should see notification with 'Your card has been declined.'
    And I take a snapshot called 'Stripe: Failed payment with declined with stolen_card'

  Scenario: Failed payment with declined with expired_card
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    And I enter '4000000000000069' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    Then I wait for 'Notification' to show up
    And I should see notification with 'Your card has expired.'
    And I take a snapshot called 'Stripe: Failed payment with declined with expired_card'

  Scenario: Failed payment with declined with incorrect_cvc
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    And I enter '4000000000000127' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    Then I wait for 'Notification' to show up
    And I should see notification with 'Your card's security code is incorrect.'
    And I take a snapshot called 'Stripe: Failed payment with declined with incorrect_cvc'

  Scenario: Failed payment with declined with processing_error
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    And I enter '4000000000000119' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    Then I wait for 'Notification' to show up
    And I should see notification with 'An error occurred while processing your card. Try again in a little bit.'
    And I take a snapshot called 'Stripe: Failed payment with declined with processing_error'

  Scenario: Card validated
    Given I navigate to '/tickets/attendees'
    And I click 'Accept Cookies'
    And I click 'GA - Book Me'
    And I fill in the test customer details
    And I click 'Payment -> Pay with stripe'
    When I enter '4242424242424241' into 'Payment -> Card number' like a human
    Then I should see a 'Payment -> Card error' with the text 'Your card number is invalid.'
    And I take a snapshot called 'Stripe: Failed payment with declined with incorrect_number'
