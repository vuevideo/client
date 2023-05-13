const tCorrectUsername = 'testusername';
const tCorrectPassword = 'testpassword';
const tCorrectName = 'test name';
const tCorrectEmail = 'test@example.com';

const tIncorrectUsername = 'test';
const tIncorrectPassword = 'test';
const tIncorrectName = 'test';
const tIncorrectEmail = 'test@example@com';

const tAlreadyUsedUsername = 'alreadyUsed';
const tAlreadyUsedEmail = 'already@used.com';

describe('Registration', () => {
  it('passes for proper fields added', () => {
    // Arrange
    cy.visit('/register');

    // Act
    cy.get('[data-cy="username"]').type(tCorrectUsername);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tCorrectPassword);

    // Assert
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).to.contain('/login');
    });
  });

  it('fails for empty fields validation', () => {
    // Arrange
    cy.visit('/register');

    // Act
    cy.get('[data-cy="username"]').type('');
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tCorrectPassword);

    // Assert
    cy.get('[data-cy="username"]').should(
      'contain.text',
      'Username is a required field.'
    );
  });

  it('fails for incorrect fields validation', () => {
    // Arrange
    cy.visit('/register');

    // Act
    cy.get('[data-cy="username"]').type(tIncorrectUsername);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tCorrectPassword);

    // Assert
    cy.get('[data-cy="username"]').should(
      'contain.text',
      'The given username is invalid.'
    );
  });

  it('fails for non matching passwords', () => {
    // Arrange
    cy.visit('/register');

    // Act
    cy.get('[data-cy="username"]').type(tIncorrectUsername);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tIncorrectPassword);

    // Assert
    cy.get('[data-cy="password"]').should(
      'contain.text',
      'Passwords do not match.'
    );
  });
});

