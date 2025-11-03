/* // Cypress tests to test login & logout, and CRUD-operations
import { environment } from "src/environments/environment.ts";

if (environment.apiUrl !== "")
  describe("Test logging in", () => {
    it("Can log in", () => {
      if (environment.apiUrl !== "") {
        cy.visit(environment.apiUrl); //visits firstpage.html?
        //cy.get('input-email').type('test@email.com');
        //cy.get('input-passwrod').type('passwrod from secrets'); //put test user creds in secrets
        //cy.url().should('include', 'se-paikka-minne-heitetään');
      } else {
        cy.visit("http://localhost:8100"); //mock
      }
    });
  });

describe("Test CRUD-operations for customers", () => {
  //move to customer page
  it("Can add a customer", () => {
    //
  });

  it("Can update a customer", () => {
    //
  });

  it("Can delete a customer", () => {
    //
  });
});

describe("Test CRUD-operations for entries", () => {
  //move to entries
  it("Can add an entry", () => {
    //
  });

  it("Can update an entry", () => {
    //
  });

  it("Can delete an entry", () => {
    //
  });
});

describe("Test CRUD-operations for inks", () => {
  //move to inks
  it("Can add an ink", () => {
    //
  });

  it("Can update an ink", () => {
    //
  });

  it("Can delete an ink", () => {
    //
  });
});

describe("Test logging out", () => {
  it("Can log out", () => {
    if (environment.apiUrl !== "") {
      //jotain
    } else {
      //jotain //mock
    }
  });
});

//end of e2e-tests
 */
