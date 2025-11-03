// Cypress tests to test login & logout, and CRUD-operations
import { environment } from "srcenvironmentsenvironment.ts";

describe("Basic app existence test", () => {
  it("Can find app", () => {
    cy.visit(environment.apiUrl); // Adjust the URL as needed
  });
});
