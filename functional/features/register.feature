Feature: Register

  Scenario: Can register
    Given I navigate to '/'
    And I click 'button.btn.btn-primary-blue.login-register'
    And I click '.register-btn'
    And I should see '.signup'
    And I enter 'Luis Serralheiro' into '.signup .name'
    And I enter 'encavadas@gmail.com' into '.signup .username'
    And I enter 'mytestpassword' into '.signup .password'
    And I enter 'mytestpassword' into '.signup .password-confirm'
    And I click '.signup .tcs'
    When I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    Then I should see a '.email-sent' with the text ''

  Scenario: Can cancel register
    Given I navigate to '/'
    And I click 'button.btn.btn-primary-blue.login-register'
    And I click '.register-btn'
    And I should see '.signup'
    When I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(1)'
    And I wait for the page to load
    Then I should not see '.signup'

  Scenario: Short name is rejected
    Given I navigate to '/'
    And I click 'button.btn.btn-primary-blue.login-register'
    And I click '.register-btn'
    And I should see '.signup'
    And I enter '12345' into '.signup .name'
    When I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    Then I should see '.signup .line.has-error .name'
    And I enter '123456' into '.signup .name'
    And I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    And I should not see '.signup .line.has-error .name'

  Scenario: Invalid email is rejected
    Given I navigate to '/'
    And I click 'button.btn.btn-primary-blue.login-register'
    And I click '.register-btn'
    And I should see '.signup'
    And I enter '12345' into '.signup .username'
    When I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    Then I should see '.signup .line.has-error .username'
    And I enter '12345@a.pt' into '.signup .username'
    And I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    And I should not see '.signup .line.has-error .username'

  Scenario: Short password is rejected
    Given I navigate to '/'
    And I click 'button.btn.btn-primary-blue.login-register'
    And I click '.register-btn'
    And I should see '.signup'
    And I enter '12345' into '.signup .password'
    When I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    Then I should see '.signup .line.has-error .password'
    And I enter '123456' into '.signup .password'
    And I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    And I should not see '.signup .line.has-error .password'

  Scenario: Not matching passwords is rejected
    Given I navigate to '/'
    And I click 'button.btn.btn-primary-blue.login-register'
    And I click '.register-btn'
    And I should see '.signup'
    And I enter '123456' into '.signup .password'
    And I enter '12345' into '.signup .password-confirm'
    When I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    Then I should see '.signup .line.has-error .password-confirm'
    And I enter '123456' into '.signup .password-confirm'
    And I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    And I should not see '.signup .line.has-error .password-confirm'

  Scenario: Tcs not accepted is rejected
    Given I navigate to '/'
    And I click 'button.btn.btn-primary-blue.login-register'
    And I click '.register-btn'
    And I should see '.signup'
    When I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    Then I should see '.signup .line.has-error .tcs'
    And I click '.signup .tcs'
    And I click '.ajs-modal .ajs-footer .ajs-primary .ajs-button:nth-child(2)'
    And I should not see '.signup .line.has-error .tcs'
