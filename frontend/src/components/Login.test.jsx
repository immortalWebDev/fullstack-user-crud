// We import React because we are using JSX (<Login />) inside this file.
// JSX internally becomes React.createElement(), so React must be available.
import React from "react";

// render → used to mount the component into a fake DOM (jsdom)
// screen → helps us find elements in the DOM like a real user
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";


// Import the component we want to test
import Login from "./Login";


// describe() is used to group related tests together.
// The string is just a label shown in the test output.
// It can be anything, but it should describe what we are testing.
describe("Login Component", () => {

  // it() defines one individual test case.
  // The string explains what this specific test is checking.
  it("renders email, password and login button", () => {

    // render() mounts the Login component into a fake browser environment.
    // We pass a dummy function for setIsLoggedIn because
    // the component expects that prop.
    // We don't care what it does in this test.
    render(<Login setIsLoggedIn={() => {}} />);


    // screen.getByPlaceholderText() finds an input
    // that has placeholder="Email"
    // If it does not exist, this line will throw an error.
    const emailInput = screen.getByPlaceholderText("Email");

    // Same logic for password input
    const passwordInput = screen.getByPlaceholderText("Password");

    // screen.getByRole() finds elements by their accessibility role.
    // A button has role="button".
    // { name: /login/i } means:
    // Find button whose text matches "login" (case insensitive).
    const loginButton = screen.getByRole("button", { name: /login/i });


    // expect() is used to check if something is true.
    // toBeInTheDocument() comes from @testing-library/jest-dom.
    // It checks whether the element actually exists in the DOM.

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });


  it("allows user to type email and password", async () => {

    // Render component
    render(<Login setIsLoggedIn={() => {}} />);

    // Create a virtual user
    const user = userEvent.setup();

    // Find input fields
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Simulate typing
    await user.type(emailInput, "test@gmail.com");
    await user.type(passwordInput, "123456");

    // Check if values changed correctly
    expect(emailInput).toHaveValue("test@gmail.com");
    expect(passwordInput).toHaveValue("123456");
  });
});