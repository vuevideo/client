const tCorrectUsername = 'testusername';
const tCorrectPassword = 'testpassword';
const tCorrectName = 'testname';
const tCorrectEmail = 'test@example.com';

const tIncorrectUsername = 'test';
const tIncorrectPassword = 'test';
const tIncorrectName = 'test';
const tIncorrectEmail = 'test@example@com';

const tAlreadyUsedUsername = 'alreadyUsed';
const tAlreadyUsedEmail = 'already@used.com';
const tAlreadyUsedPassword = 'testtest';

describe('/register', () => {
  beforeEach(() => {
    cy.visit('/register');
    cy.intercept('POST', '**/auth', (req) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(req.continue()), 2000); // delay by 5 seconds
      });
    }).as('postAuth');
  });

  it('fails for empty fields validation', () => {
    // Arrange
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tCorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('[data-cy="username"]').should(
      'contain.text',
      'Username is required.'
    );
  });

  it('fails for incorrect fields validation', () => {
    // Arrange
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="username"]').type(tIncorrectUsername);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tCorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('[data-cy="username"]').should(
      'contain.text',
      'Username must be atleast of 5 characters.'
    );
  });

  it('fails for non matching passwords', () => {
    // Arrange
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="username"]').type(tCorrectUsername);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tIncorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('[data-cy="passwordAgain"]').should(
      'contain.text',
      'Passwords do not match.'
    );
  });

  it('fails for duplicate email address', () => {
    // Arrange
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="username"]').type(tCorrectUsername);
    cy.get('[data-cy="email"]').type(tAlreadyUsedEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tCorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="error"]', { timeout: 10000 }).should(
      'contain.text',
      'This email address is already taken.'
    );
  });

  it('fails for duplicate username', () => {
    // Arrange
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="username"]').type(tAlreadyUsedUsername);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tCorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="error"]', { timeout: 10000 }).should(
      'contain.text',
      'This username is already taken.'
    );
  });

  it('passes for proper fields added', () => {
    // Arrange
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="username"]').type(tCorrectUsername);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tCorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).to.contain('/login');
    });
  });
});
