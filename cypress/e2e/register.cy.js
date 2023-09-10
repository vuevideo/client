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
    cy.fillForm({
      '[data-cy="name"]': tCorrectName,
      '[data-cy="email"]': tCorrectEmail,
      '[data-cy="password"]': tCorrectPassword,
      '[data-cy="passwordAgain"]': tCorrectPassword,
    });

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
    cy.fillForm({
      '[data-cy="name"]': tCorrectName,
      '[data-cy="username"]': tIncorrectUsername,
      '[data-cy="email"]': tCorrectEmail,
      '[data-cy="password"]': tCorrectPassword,
      '[data-cy="passwordAgain"]': tCorrectPassword,
    });

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
    cy.fillForm({
      '[data-cy="name"]': tCorrectName,
      '[data-cy="username"]': tCorrectUsername,
      '[data-cy="email"]': tCorrectEmail,
      '[data-cy="password"]': tCorrectPassword,
      '[data-cy="passwordAgain"]': tIncorrectPassword,
    });

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
    cy.fillForm({
      '[data-cy="name"]': tCorrectName,
      '[data-cy="username"]': tCorrectUsername,
      '[data-cy="email"]': tAlreadyUsedEmail,
      '[data-cy="password"]': tCorrectPassword,
      '[data-cy="passwordAgain"]': tCorrectPassword,
    });

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
    cy.fillForm({
      '[data-cy="name"]': tCorrectName,
      '[data-cy="username"]': tAlreadyUsedUsername,
      '[data-cy="email"]': tCorrectEmail,
      '[data-cy="password"]': tCorrectPassword,
      '[data-cy="passwordAgain"]': tCorrectPassword,
    });

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
    cy.fillForm({
      '[data-cy="name"]': tCorrectName,
      '[data-cy="username"]': tCorrectUsername,
      '[data-cy="email"]': tCorrectEmail,
      '[data-cy="password"]': tCorrectPassword,
      '[data-cy="passwordAgain"]': tCorrectPassword,
    });

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).to.contain('/login');
    });
  });
});
