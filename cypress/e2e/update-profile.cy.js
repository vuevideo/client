const loginEmail = 'already@used.com';
const loginPassword = 'testtest';

const tCorrectUsername = 'testusername';
const tCorrectPassword = 'testpassword';
const tCorrectName = 'testname';
const tCorrectEmail1 = 'already@used.com';
const tCorrectEmail2 = 'already+anotherone@used.com';

const tIncorrectUsername = 'test';
const tIncorrectAlreadyUsedUsername = 'alreadyUsedtest';
const tIncorrectName = 'test';
const tIncorrectEmail = 'test@example@com';
const tIncorrectPassword = 'test';

const tAlreadyUsedUsername = 'alreadyUsed';
const tAlreadyUsedEmail = 'already+test@used.com';
const tAlreadyUsedPassword = 'testtest';

const tNewPassword = 'test123';

describe('/user/profile', () => {
  beforeEach(() => {
    cy.login(loginEmail, loginPassword);
    cy.wait(3000);
    cy.intercept('POST', '**/user/**', (req) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(req.continue()), 2000); // delay by 2 seconds
      });
    }).as('postUser');

    cy.intercept('DELETE', '**/user/**', (req) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(req.continue()), 2000); // delay by 2 seconds
      });
    }).as('deleteUser');
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

    it('uploads new profile picture', () => {
      // Arrange
      cy.get('[data-cy="img-upload"]').invoke('removeAttr', 'class');

      // Act
      cy.get('[data-cy="img-upload"]').selectFile('cypress/data/image.jpg');

      // Assert
      cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="success"]', { timeout: 20000 }).should(
        'contain.text',
        'Profile update was a success!'
      );
    });
  });

  describe('Update Email tab', () => {
    beforeEach(() => {
      cy.visit('/user/profile', {
        timeout: 10000,
      });

      cy.wait(3000);

      cy.get('[data-cy="update-email"]').click();
      cy.clearForm(['[data-cy="email"]']);
    });

    it('fails for empty fields validation', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="email"]': tCorrectEmail1,
      });

      // Act
      cy.get('[data-cy="submit-email-btn"]').click();

      // Assert
      cy.get('[data-cy="password"]').should(
        'contain.text',
        'Password must be atleast of 5 characters.'
      );
    });

    it('fails for incorrect fields validation', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="email"]': tIncorrectEmail,
        '[data-cy="password"]': loginPassword,
      });

      // Act
      cy.get('[data-cy="submit-email-btn"]').click();

      // Assert
      cy.get('[data-cy="email"]').should(
        'contain.text',
        'The given email address is invalid.'
      );
    });

    it('fails for duplicate email address', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="email"]': tAlreadyUsedEmail,
        '[data-cy="password"]': loginPassword,
      });

      // Act
      cy.get('[data-cy="submit-email-btn"]').click();

      // Assert
      cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="error"]', { timeout: 10000 }).should(
        'contain.text',
        'Email provided is already in use.'
      );
    });

    it('passes for proper fields added for the same email', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="email"]': tCorrectEmail1,
        '[data-cy="password"]': loginPassword,
      });

      // Act
      cy.get('[data-cy="submit-email-btn"]').click();

      // Assert
      cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="success"]', { timeout: 10000 }).should(
        'contain.text',
        'Email Address update was a success!'
      );
    });

    it('passes for proper fields added for a different email', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="email"]': tCorrectEmail2,
        '[data-cy="password"]': loginPassword,
      });

      // Act
      cy.get('[data-cy="submit-email-btn"]').click();

      // Assert
      cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="success"]', { timeout: 10000 }).should(
        'contain.text',
        'Email Address update was a success!'
      );

      // Cleanup
      cy.clearForm(['[data-cy="email"]', '[data-cy="password"]']);
      cy.fillForm({
        '[data-cy="email"]': tCorrectEmail1,
        '[data-cy="password"]': loginPassword,
      });
      cy.get('[data-cy="submit-email-btn"]').click();
      cy.wait(3000);
    });
  });

  describe('Update Password tab', () => {
    beforeEach(() => {
      cy.visit('/user/profile', {
        timeout: 10000,
      });

      cy.wait(3000);

      cy.get('[data-cy="update-password"]').click();
    });

    it('fails for empty fields validation', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="old-password"]': loginPassword,
      });

      // Act
      cy.get('[data-cy="submit-password-btn"]').click();

      // Assert
      cy.get('[data-cy="new-password"]').should(
        'contain.text',
        'Password is required.'
      );
    });

    it('fails for incorrect fields validation', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="old-password"]': loginPassword,
        '[data-cy="new-password"]': tIncorrectPassword,
        '[data-cy="new-password-again"]': tIncorrectPassword,
      });

      // Act
      cy.get('[data-cy="submit-password-btn"]').click();

      // Assert
      cy.get('[data-cy="new-password"]').should(
        'contain.text',
        'New Password must be atleast of 5 characters.'
      );
    });

    it('fails for non matching passwords', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="old-password"]': loginPassword,
        '[data-cy="new-password"]': loginPassword,
        '[data-cy="new-password-again"]': tNewPassword,
      });

      // Act
      cy.get('[data-cy="submit-password-btn"]').click();

      // Assert
      cy.get('[data-cy="new-password-again"]', { timeout: 10000 }).should(
        'contain.text',
        'Passwords do not match.'
      );
    });

    it('passes for proper fields added for the same email', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="old-password"]': loginPassword,
        '[data-cy="new-password"]': tNewPassword,
        '[data-cy="new-password-again"]': tNewPassword,
      });

      // Act
      cy.get('[data-cy="submit-password-btn"]').click();

      // Assert
      cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="success"]', { timeout: 10000 }).should(
        'contain.text',
        'Password update was a success!'
      );

      // Cleanup
      cy.clearForm([
        '[data-cy="old-password"]',
        '[data-cy="new-password"]',
        '[data-cy="new-password-again"]',
      ]);
      cy.fillForm({
        '[data-cy="old-password"]': tNewPassword,
        '[data-cy="new-password"]': loginPassword,
        '[data-cy="new-password-again"]': loginPassword,
      });
      cy.get('[data-cy="submit-password-btn"]').click();
      cy.wait(3000);
    });
  });

  describe('Delete Account tab', () => {
    beforeEach(() => {
      cy.visit('/user/profile', {
        timeout: 10000,
      });

      cy.wait(3000);

      cy.get('[data-cy="delete-account"]').click();
    });

    after(() => {
      cy.wait(5000);
      cy.request({
        method: 'POST',
        url: '/api/v1/auth',
        body: {
          emailAddress: 'already@used.com',
          username: 'alreadyUsed',
          password: 'testtest',
          name: 'testtest',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('fails for empty fields validation', () => {
      // Act
      cy.get('[data-cy="delete-btn"]').click();

      // Assert
      cy.get('[data-cy="password"]').should(
        'contain.text',
        'Password is required.'
      );
    });

    it('fails for incorrect fields validation', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="password"]': tIncorrectPassword,
      });

      // Act
      cy.get('[data-cy="delete-btn"]').click();

      // Assert
      cy.get('[data-cy="password"]').should(
        'contain.text',
        'Password must be atleast of 5 characters.'
      );
    });

    it('passes for proper fields added', () => {
      // Arrange
      cy.fillForm({
        '[data-cy="password"]': loginPassword,
      });

      // Act
      cy.get('[data-cy="delete-btn"]').click();

      // Assert
      cy.get('.v-btn__loader', { timeout: 10000 }).should('be.visible');
    });
  });
});
