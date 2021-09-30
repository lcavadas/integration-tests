Feature: Test

  Scenario: Test
    Given There is an order on 'ws21' with
      | quantity | product          |
      | 1        | General Attendee |
    And I fill in the test address details
    And I click 'Payment -> Pay with stripe'
    And I enter '4242424242424242' into 'Payment -> Card number' like a human
    And I enter '0130' into 'Payment -> Expiry date' like a human
    And I enter '123' into 'Payment -> CVV' like a human
    And I click 'Payment -> Accept T&Cs'
    When I click 'Payment -> Pay securely now'
    And I wait for 'Payment Loader' to show up
    And I wait for 'Payment Loader' to go away
    And I wait for 'Success page' to show up
    Then I should see 'Success page'
