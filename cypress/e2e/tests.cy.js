describe('Blog app', function() {
  beforeEach(function() {
    //cy.request('POST', 'http://localhost:3001/api/login')
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:5173')
    const user = {
      username: 'testuser',
      password: 'testpassword',
      name: 'Test User'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown after clicking the "log in" button', function() {
    cy.contains('log in').click()
    cy.contains('Login').should('be.visible')
    cy.get('input[value=""]').first().should('be.visible') // Input del username
    cy.get('input[type="password"]').should('be.visible') // Input de la contraseña
    cy.contains('login').should('be.visible') // Botón de login
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('input[value=""]').first().type('testuser')
      cy.get('input[type="password"]').type('testpassword')
      cy.contains('login').click()
      cy.contains('Test User logged in').should('be.visible')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[value=""]').first().type('testuser')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.contains('login').click()
      cy.contains('wrong credentials').should('be.visible')
      cy.get('html').should('not.contain', 'Test User logged in')
    })
  })
})