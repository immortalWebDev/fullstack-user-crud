import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    // 🔹 This sets the base URL for cy.visit()
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
