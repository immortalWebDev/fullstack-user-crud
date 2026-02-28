// Cypress test suite for real authentication flow
// This is an end-to-end (E2E) test that verifies:
// 1. Initial auth check
// 2. Login API success
// 3. Protected route access
// 4. Dashboard rendering

describe("Login Flow - Real Authentication", () => {

  // 'it' defines a single test case inside the suite
  // This test verifies that a valid admin can log in
  // and see the protected dashboard
  it("logs in with valid admin credentials and shows dashboard", () => {

    // ---------------------------------------------------------
    // 🔹 cy.intercept()
    // ---------------------------------------------------------
    // This listens to outgoing network requests.
    // We alias them so we can wait and assert on them later.
    //
    // "**" means match any protocol, domain, or port.
    // This prevents strict URL mismatch issues.
    //
    // We intercept:
    // - GET /api/auth/me  → session validation
    // - POST /api/auth/login → login request
    // - GET /api/users → protected data fetch after login

    cy.intercept("GET", "**/api/auth/me").as("getMe");
    cy.intercept("POST", "**/api/auth/login").as("loginRequest");
    cy.intercept("GET", "**/api/users").as("getUsers");


    // ---------------------------------------------------------
    // 🔹 cy.visit()
    // ---------------------------------------------------------
    // Opens the frontend application in Cypress browser.
    // This simulates a real user navigating to the app.
    //
    // The app on load automatically calls /auth/me to
    // check if a session cookie already exists.

    cy.visit("/");


    // ---------------------------------------------------------
    // 🔹 cy.wait()
    // ---------------------------------------------------------
    // Waits for the intercepted request with alias "getMe".
    //
    // On initial load, this will return 401
    // because the user is not logged in yet.
    //
    // We wait to ensure the app finishes initial auth check
    // before interacting with the UI.

    cy.wait("@getMe");


    // ---------------------------------------------------------
    // 🔹 cy.get()
    // ---------------------------------------------------------
    // Selects a DOM element using CSS selector.
    //
    // Here we select the email input field.
    // Cypress automatically retries until element exists.

    cy.get('input[placeholder="Email"]')

      // -------------------------------------------------------
      // 🔹 .should("be.visible")
      // -------------------------------------------------------
      // Assertion that ensures element is visible before typing.
      // Prevents race condition if UI not fully rendered.

      .should("be.visible")

      // -------------------------------------------------------
      // 🔹 .type()
      // -------------------------------------------------------
      // Simulates user typing into input field.

      .type("pgbadgujar007@gmail.com");


    // Same process for password input
    cy.get('input[placeholder="Password"]')
      .should("be.visible")
      .type("qqqq");


    // ---------------------------------------------------------
    // 🔹 Click Submit Button
    // ---------------------------------------------------------
    // We select button by type="submit"
    // This ensures form submission happens correctly.
    //
    // Using contains("Login") can be unstable.
    // Selecting by attribute is more deterministic.

    cy.get('button[type="submit"]').click();


    // ---------------------------------------------------------
    // 🔹 Wait for Login API
    // ---------------------------------------------------------
    // Now we wait for the POST /login request.
    // Then we assert its response status code.
    //
    // .its() extracts property from intercepted object.
    // Here we access response.statusCode.

    cy.wait("@loginRequest")
      .its("response.statusCode")
      .should("eq", 200);  // Login must succeed


    // ---------------------------------------------------------
    // 🔹 Wait for Protected Resource Fetch
    // ---------------------------------------------------------
    // After login:
    // - Cookie is set (HTTP-only)
    // - App sets isLoggedIn = true
    // - Dashboard renders
    // - UserCrud component mounts
    // - /api/users is called
    //
    // That is why we wait for getUsers here.

    cy.wait("@getUsers")
      .its("response.statusCode")

      // Accept both:
      // 200 → Fresh response
      // 304 → Cached response (Not Modified)
      //
      // 304 is valid HTTP success in conditional requests.

      .should("be.oneOf", [200, 304]);


    // ---------------------------------------------------------
    // 🔹 Final UI Assertion
    // ---------------------------------------------------------
    // Ensures dashboard heading is visible.
    // Confirms that authentication + rendering succeeded.

    cy.contains("Admin Dashboard")
      .should("be.visible");

  });

});