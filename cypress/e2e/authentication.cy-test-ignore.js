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
const tAlreadyUsedPassword = 'testtest';

describe('/register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('passes for proper fields added', () => {
    // Arrange

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

  it('fails for duplicate email address', () => {
    // Arrange

    // Act
    cy.get('[data-cy="username"]').type(tCorrectUsername);
    cy.get('[data-cy="email"]').type(tAlreadyUsedUsername);
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tIncorrectPassword);

    // Assert
    cy.get('[data-cy="errors"]').should(
      'contain.text',
      'Account with this email address already exists.'
    );
  });

  it('fails for duplicate username', () => {
    // Arrange

    // Act
    cy.get('[data-cy="username"]').type(tAlreadyUsedUsername);
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="name"]').type(tCorrectName);
    cy.get('[data-cy="password"]').type(tCorrectPassword);
    cy.get('[data-cy="passwordAgain"]').type(tIncorrectPassword);

    // Assert
    cy.get('[data-cy="errors"]').should(
      'contain.text',
      'Account with this username already exists.'
    );
  });
});

describe('/login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('passes for proper fields added', () => {
    // Arrange

    // Act
    cy.get('[data-cy="email"]').type(tAlreadyUsedEmail);
    cy.get('[data-cy="password"]').type(tAlreadyUsedPassword);

    // Assert
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).to.contain('/authenticated');
    });
  });

  it('fails for non registered email address', () => {
    // Arrange

    // Act
    cy.get('[data-cy="email"]').type(tCorrectEmail);
    cy.get('[data-cy="password"]').type(tAlreadyUsedPassword);

    // Assert
    cy.get('[data-cy="errors"]').should(
      'contain.text',
      'Account with this email address does not exist.'
    );
  });

  it('fails for wrong password', () => {
    // Arrange

    // Act
    cy.get('[data-cy="email"]').type(tAlreadyUsedEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);

    // Assert
    cy.get('[data-cy="errors"]').should(
      'contain.text',
      'Password is incorrect'
    );
  });

  it('fails for invalid format for email address', () => {
    // Arrange

    // Act
    cy.get('[data-cy="email"]').type(tIncorrectEmail);
    cy.get('[data-cy="password"]').type(tCorrectPassword);

    // Assert
    cy.get('[data-cy="email"]').should(
      'contain.text',
      'The given email address in invalid'
    );
  });

  it('fails for empty fields validation', () => {
    // Arrange

    // Act
    cy.get('[data-cy="email"]').type('');
    cy.get('[data-cy="password"]').type(tCorrectPassword);

    // Assert
    cy.get('[data-cy="email"]').should(
      'contain.text',
      'Email address is a required field.'
    );
  });
});

