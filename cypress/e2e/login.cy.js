const tCorrectPassword = 'testpassword';
const tCorrectEmail = 'not@used.com';

const tIncorrectPassword = 'test';
const tIncorrectEmail = 'test@example@com';

const tAlreadyUsedEmail = 'already@used.com';
const tAlreadyUsedPassword = 'testtest';

describe('/login', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/**', (req) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(req.continue()), 2000); // delay by 5 seconds
      });
    }).as('postAuth');
  });

  it('fails for empty fields validation', () => {
    // Arrange
    cy.get('[data-cy="password"]').type(tCorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('[data-cy="email"]').should(
      'contain.text',
      'Email Address is required.'
    );
  });

  it('fails for invalid format for email address', () => {
    // Arrange
    cy.get('[data-cy="email"]').type(tIncorrectEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('[data-cy="email"]').should(
      'contain.text',
      'The given email address is invalid.'
    );
  });

  it('fails for non registered email address', () => {
    // Arrange
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="password"]').type(tAlreadyUsedPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="error"]', { timeout: 10000 }).should(
      'contain.text',
      'This email is not registered to any account.'
    );
  });

  it('fails for wrong password', () => {
    // Arrange
    cy.get('[data-cy="email"]').type(tAlreadyUsedEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="error"]', { timeout: 10000 }).should(
      'contain.text',
      'You have typed a wrong password, please try again.'
    );
  });

  it('passes for proper fields added', () => {
    // Arrange
    cy.get('[data-cy="email"]').type(tAlreadyUsedEmail);
    cy.get('[data-cy="password"]').type(tAlreadyUsedPassword);

    // Act
    cy.get('[data-cy="btn"]').click();

    // Assert
    cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).to.contain('/authenticated');
    });
  });
});

