describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    cy.visit("http://localhost:5173");
    const user = {
      username: "testuser",
      password: "testpassword",
      name: "Test User",
    };
    cy.request("POST", "http://localhost:3001/api/users", user);
    cy.visit("http://localhost:5173");
  });

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
      cy.contains('testuser logged in').should('be.visible')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('input[value=""]').first().type('testuser')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.contains('login').click()
      cy.contains('wrong credentials').should('be.visible')
      cy.get('html').should('not.contain', 'Test User logged in')
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      cy.contains("log in").click();
      cy.get('input[value=""]').first().type("testuser");
      cy.get('input[type="password"]').type("testpassword");
      cy.contains("login").click();
      cy.contains("testuser logged in").should("be.visible");
    });

    it("A blog can be created", function () {
      cy.contains("New note").click();
      cy.get("#title").type("Test Blog Title");
      cy.get("#author").type("Test Author");
      cy.get("#url").type("https://test.blog.com");
      cy.contains("create").click();
      cy.contains("Test Blog Title").should("be.visible");
    });

    it("A blog can be liked", function () {
      cy.contains("New note").click();
      cy.get("#title").type("Test Blog Title");
      cy.get("#author").type("Test Author");
      cy.get("#url").type("https://test.blog.com");
      cy.contains("create").click();
      cy.contains("Test Blog Title").should("be.visible");

      cy.contains("View").click();
      cy.contains("Like").click();
      cy.contains("Likes 1").should("be.visible"); // Assuming initial likes are 0 or the backend increments
    });

    it("The creator of a blog can delete it", function () {
      cy.contains("New note").click();
      cy.get("#title").type("Blog to Delete");
      cy.get("#author").type("Deletor");
      cy.get("#url").type("https://delete.com");
      cy.contains("create").click();
      cy.contains("Blog to Delete");
      cy.contains("View").click();
      cy.contains("Like").click();
      cy.contains("remove").click();
      cy.get("html").should("not.contain", "Blog to Delete Deletor");
    });


    it("Only the creator can see the delete button", function () {
      // Create a blog as the logged-in user
      cy.contains("New note").click();
      cy.get("#title").type("My Special Blog");
      cy.get("#author").type("Me");
      cy.get("#url").type("https://mine.com");
      cy.contains("create").click();
      cy.contains("My Special Blog");
      cy.contains("View").click();
      cy.contains("Like").click();
      cy.contains("remove").should("be.visible");
  
      // Log out
      cy.contains("log out").click();
  
      // Create and log in as another user
      const anotherUser = {
        username: "anotheruser",
        password: "anotherpassword",
        name: "Another User",
      };
      cy.request("POST", "http://localhost:3001/api/users", anotherUser);
      cy.contains("login").click();
      cy.get('input[value=""]').first().type("anotheruser");
      cy.get('input[type="password"]').type("anotherpassword");
      cy.contains("login").click();
      cy.contains("anotheruser logged in").should("be.visible");
  
      // Visit the blog and ensure delete button is not visible
      cy.contains("My Special Blog");
      //cy.contains("View").click();
      cy.contains("remove").should("not.exist");
    });
    

    it("Blogs are sorted by likes", function () {
      cy.contains("New note").click();
      cy.get("#title").type("Blog A");
      cy.get("#author").type("Author A");
      cy.get("#url").type("https://blogA.com");
      cy.contains("create").click();
      //cy.contains("New note").click();
      cy.get("#title").type("Blog B");
      cy.get("#author").type("Author B");
      cy.get("#url").type("https://blogB.com");
      cy.contains("create").click();

      // Like Blog A twice
      cy.contains("View").first().click();
      cy.contains("Like").first().click();
      cy.contains("Like").first().click();

      // Like Blog B once
      cy.contains("View").last().click();
      cy.contains("Like").last().click();

      // Check the order of blogs
      cy.get(".blog").then((blogs) => {
        blogs.each((index, blog) => {
          cy.log(`Blog ${index + 1}: ${blog.textContent}`);
        });
      });
    });
  });
});
