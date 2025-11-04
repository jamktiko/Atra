// Cypress tests to test login & logout, and CRUD-operations
// each test has isolated log in-event for test isolation

//for e2e tests to run, the following conditions need to be met (automatically implemented in prod-workflow)
//1. ionic serve is on
//2. environment.isProd = true
//3. cloud infrastructure is on
//4. environment.apiUrl is correct

import { environment } from "src/environments/environment.ts";
let url = "http://localhost:8100";
const sleeptime = 2500;

//only run tests in prod
if (environment.apiUrl !== "") {
  /*   beforeEach(() => {
    //TODO: LOG IN
  });
  afterEach(() => {
    //TODO: LOG OUT
  }); */

  //these work!
  //TODO: test invalid inputs for add customer form
  describe("Test CRUD-operations for customers", () => {
    it("Can move to customers-page", () => {
      cy.visit(`${url}/tabs/firstpage`);
      cy.get('ion-tab-button[tab="customers"]', {
        includeShadowDom: true,
      }).click();
      cy.url().should("include", "/tabs/customers");
    });

    it("Can add and update a customer", () => {
      //add customer
      cy.visit(`${url}/tabs/customers`);
      cy.contains("button", "Add new").click();
      cy.get("#firstname").type("Test");
      cy.get("#lastname").type("Tester");
      cy.get("#email").type("test@mail.com");
      cy.get("#tel").type("123456789");
      cy.get("#notes").type("Notes here");
      cy.wait(sleeptime);
      cy.contains("button", "Continue").click();
      cy.wait(sleeptime);
      cy.contains("button", "Confirm").click();
      cy.wait(sleeptime);

      //update customer
      cy.visit(`${url}/tabs/customers`);
      cy.wait(sleeptime);
      cy.get("h3").contains("Tester, Test").click();
      cy.get("#first-name").clear().type("Åäö");
      cy.get("button").contains("Update").click();
      cy.wait(sleeptime);
    });

    it("Can delete a customer", () => {
      cy.visit(`${url}/tabs/customers`);
      cy.wait(sleeptime);
      cy.get("h3").contains("Tester, Åäö").click();
      cy.get("button").contains("Delete").click();
      cy.visit(`${url}/tabs/customers`);
      cy.contains("h3", "Tester, Åäö").should("not.exist");
      cy.wait(sleeptime);
    });
  });

  /*   describe("Test CRUD-operations for entries", () => {
    it("Can move to entries-page", () => {
      cy.visit(`${url}/tabs/firstpage`);
      cy.get('ion-tab-button[tab="entries"]', {
        includeShadowDom: true,
      }).click();
      cy.url().should("include", "/tabs/entries");
    });
    it("Can add an entry", () => {
      cy.get("button").contains("Add new").click();
      //add customer
      //add date
      //add one ink, any ink
      cy.get("#notes").type("Very good notes here");
      cy.get("button").contains("Continue").click();
    });

    it("Can update an entry", () => {
      cy.visit(`${url}/tabs/entries`);
      //get created entry
      //update any field
      //cy.get("button").contains("Update").click();
    });

    it("Can delete an entry", () => {
      cy.visit(`${url}/tabs/entries`);
      //get updated entry
      //delete it
      //check it no longer exists
    });
  }); */

  describe("Test CRUD-operations for inks", () => {
    it("Can move to inks-page", () => {
      cy.visit(`${url}/tabs/firstpage`);
      cy.get('ion-tab-button[tab="inks"]', {
        includeShadowDom: true,
      }).click();
      cy.url().should("include", "/tabs/inks");
    });

    it("Can add and update an ink", () => {
      //add ink
      cy.visit(`${url}/tabs/inks`);
      cy.get("button").contains("Add new").click();
      cy.wait(sleeptime);
      cy.get('input[type="button"][value="Select"]')
        .should("be.visible")
        .first()
        .click();
      cy.wait(sleeptime);
      cy.get("button").contains("Continue").click();
      cy.get("button").contains("Yes, continue").should("be.disabled");
      cy.get('input[placeholder="Insert batchnumber"]').type("test");
      cy.get("button").contains("Yes, continue").click();
      cy.wait(sleeptime);

      //update ink
      cy.visit(`${url}/tabs/inks`);
      cy.wait(sleeptime);
      cy.get("p").contains("Batch: test").first().click();
      cy.wait(sleeptime);
      cy.get("button")
        .contains("Update info")
        .should("be.visible")
        .first()
        .click();
      //TODO: test invalid inputs on form
      cy.contains("label", "Opened:")
        .next('input[type="date"]')
        .type(new Date().toISOString().split("T")[0]);
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      const formattedDate = oneYearLater.toISOString().split("T")[0];
      cy.contains("label", "Expires at:")
        .next('input[type="date"]')
        .type(formattedDate);
      cy.get("#batchnumber").clear().type("DELETE-ME");
      cy.wait(sleeptime);
      cy.get("button").contains("Confirm").should("be.visible").first().click();
      cy.wait(sleeptime);
    });

    it("Can delete an ink", () => {
      cy.visit(`${url}/tabs/inks`);
      cy.wait(sleeptime);
      cy.get("p").contains("Batch: DELETE-ME").first().click();
      cy.wait(sleeptime);
      cy.get("button")
        .contains("Delete ink")
        .should("be.visible")
        .first()
        .click();
      cy.wait(sleeptime);
      cy.contains("p", "Batchnumber: DELETE-ME").should("not.exist");
      cy.wait(sleeptime);
    });
  });
}

//end of e2e-tests
