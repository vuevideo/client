const tCorrectUsername = 'testusername';
const tCorrectPassword = 'testpassword';
const tCorrectName = 'testname';

const tIncorrectUsername = 'test';
const tIncorrectAlreadyUsedUsername = 'alreadyUsedtest';
const tIncorrectName = 'test';

const tAlreadyUsedUsername = 'alreadyUsed';
const tAlreadyUsedEmail = 'already@used.com';
const tAlreadyUsedPassword = 'testtest';

describe('/user/profile', () => {
  beforeEach(() => {
    cy.login(tAlreadyUsedEmail, tAlreadyUsedPassword);
    cy.wait(3000);
    cy.intercept('POST', '**/user', (req) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(req.continue()), 2000); // delay by 2 seconds
      });
    }).as('postUser');
  });

  describe('Update Profile tab', () => {
    beforeEach(() => {
      cy.visit('/user/profile', {
        timeout: 10000,
      });

      cy.wait(3000);

      cy.get('[data-cy="update-profile"]').click();
      cy.clearForm(['[data-cy="name"]', '[data-cy="username"]']);
    });

    it('fails for empty fields validation', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="name"]': tCorrectName,
      });

      // Act
      cy.get('[data-cy="submit-btn"]').click();

      // Assert
      cy.get('[data-cy="username"]').should(
        'contain.text',
        'Username must be atleast of 5 characters.'
      );
    });

    it('fails for incorrect fields validation', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="name"]': tCorrectName,
        '[data-cy="username"]': tIncorrectUsername,
      });

      // Act
      cy.get('[data-cy="submit-btn"]').click();

      // Assert
      cy.get('[data-cy="username"]').should(
        'contain.text',
        'Username must be atleast of 5 characters.'
      );
    });

    it('fails for duplicate username', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="name"]': tCorrectName,
        '[data-cy="username"]': tIncorrectAlreadyUsedUsername,
      });

      // Act
      cy.get('[data-cy="submit-btn"]').click();

      // Assert
      cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="error"]', { timeout: 10000 }).should(
        'contain.text',
        'User with that username already exists'
      );
    });

    it('passes for proper fields added', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="name"]': tCorrectName,
        '[data-cy="username"]': tCorrectUsername,
      });

      // Act
      cy.get('[data-cy="submit-btn"]').click();

      // Assert
      cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="success"]', { timeout: 10000 }).should(
        'contain.text',
        'Profile update was a success!'
      );
    });
  });
});

