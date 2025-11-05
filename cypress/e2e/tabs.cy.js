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
const future = new Date("9999-01-01").toISOString().slice(0, 16);
const today = new Date().toISOString().split("T")[0];
const oneYearLater = new Date();
oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
const formattedDate = oneYearLater.toISOString().split("T")[0];

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
      })
        .should("be.visible")
        .click();
      cy.url().should("include", "/tabs/customers");
    });

    it("Can add and update a customer", () => {
      //add customer
      cy.visit(`${url}/tabs/customers`);
      cy.contains("button", "Add new").should("be.visible").click();
      cy.get("#firstname").should("be.visible").type("TEST");
      cy.get("#lastname").should("be.visible").type("DELETE");
      cy.get("#email").should("be.visible").type("test@mail.com");
      cy.get("#tel").should("be.visible").type("123456789");
      cy.get("#notes").should("be.visible").type("Notes here");
      cy.wait(sleeptime);
      cy.contains("button", "Continue").should("be.visible").click();
      cy.wait(sleeptime);
      cy.contains("button", "Confirm").should("be.visible").click();
      cy.wait(sleeptime);

      //update customer
      cy.visit(`${url}/tabs/customers`);
      cy.wait(sleeptime);
      cy.get("h3").contains("DELETE, TEST").should("be.visible").click();
      cy.get("#first-name").should("be.visible").clear().type("ME");
      cy.get("button").contains("Update").should("be.visible").click();
      cy.wait(sleeptime);
    });

    it("Can delete a customer", () => {
      cy.visit(`${url}/tabs/customers`);
      cy.wait(sleeptime);
      cy.get("h3").contains("DELETE, ME").should("be.visible").click();
      cy.get("button").contains("Delete").should("be.visible").click();
      cy.visit(`${url}/tabs/customers`);
      cy.contains("h3", "DELETE, ME").should("not.exist");
      cy.wait(sleeptime);
    });
  });

  describe("Test CRUD-operations for entries", () => {
    it("Can move to entries-page", () => {
      cy.visit(`${url}/tabs/firstpage`);
      cy.get('ion-tab-button[tab="entries"]', {
        includeShadowDom: true,
      }).click();
      cy.url().should("include", "/tabs/entries");
    });

    it("Can add an entry", () => {
      cy.visit(`${url}/tabs/entries`);
      cy.get("button").contains("Add new").should("be.visible").click();
      cy.wait(sleeptime);
      cy.get('div.ng-input input[role="combobox"]')
        .should("be.visible")
        .click();
      cy.get(".ng-option").first().should("be.visible").click();
      cy.get("#date").should("be.visible").type(future);
      cy.wait(sleeptime);
      cy.get('input[type="button"][value="Select"]')
        .first()
        .should("be.visible")
        .click();
      cy.get("button").contains("Continue").should("be.visible").click();
      cy.get("button").contains("Confirm").should("be.visible").click();
    });

    it("Can update an entry", () => {
      cy.visit(`${url}/tabs/entries`);

      //kesken
      /* cy.contains("h3", "Jan 1, 9999")
        .should("exist")
        .parent()
        .within(() => {
          cy.contains("h2", "00:00").should("exist").click();
        }); */
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
  });

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
      cy.get("button").contains("Add new").should("be.visible").click();
      cy.wait(sleeptime);
      cy.get('input[type="button"][value="Select"]')
        .should("be.visible")
        .first()
        .click();
      cy.wait(sleeptime);
      cy.get("button").contains("Continue").should("be.visible").click();
      cy.get("button").contains("Yes, continue").should("be.disabled");
      cy.get('input[placeholder="Insert batchnumber"]')
        .should("be.visible")
        .type("test");
      cy.get("button").contains("Yes, continue").should("be.visible").click();
      cy.wait(sleeptime);

      //update ink
      cy.visit(`${url}/tabs/inks`);
      cy.wait(sleeptime);
      cy.get("p").contains("Batch: test").should("be.visible").first().click();
      cy.wait(sleeptime);
      cy.get("button")
        .contains("Update info")
        .should("be.visible")
        .first()
        .click();
      //TODO: test invalid inputs on form
      cy.contains("label", "Opened:")
        .next('input[type="date"]')
        .should("be.visible")
        .type(today);
      cy.contains("label", "Expires at:")
        .next('input[type="date"]')
        .should("be.visible")
        .type(formattedDate);
      cy.get("#batchnumber").should("be.visible").clear().type("DELETE-ME");
      cy.wait(sleeptime);
      cy.get("button").contains("Confirm").should("be.visible").first().click();
      cy.wait(sleeptime);
    });

    it("Can delete an ink", () => {
      cy.visit(`${url}/tabs/inks`);
      cy.wait(sleeptime);
      cy.get("p")
        .contains("Batch: DELETE-ME")
        .should("be.visible")
        .first()
        .click();
      cy.wait(sleeptime);
      cy.get("button")
        .contains("Delete ink")
        .should("be.visible")
        .first()
        .click();
      cy.wait(sleeptime);
      cy.contains("p", "Batchnumber: DELETE-ME").should("not.exist");
    });
  });
}

//end of e2e-tests
