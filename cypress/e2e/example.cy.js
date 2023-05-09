describe('Example Test', () => {
  it('gets hello world', () => {
    cy.visit('/');

    cy.get('[data-cy="header"]').contains('Hello World!');
  });
});
