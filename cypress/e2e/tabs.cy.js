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
  beforeEach(() => {
    //log test user in
    cy.task("loginCognito", {
      username: Cypress.env("TEST_USER_EMAIL"),
      password: Cypress.env("TEST_USER_PW"),
    }).then((tokens) => {
      // Log to Cypress runner
      cy.log(`IdToken: ${tokens.IdToken}`);

      // Log to browser console
      console.log("Cognito Tokens:", tokens);

      cy.visit(`${url}/tabs/mainpage`, {
        onBeforeLoad(win) {
          win.localStorage.setItem("idToken", tokens.IdToken);
          win.localStorage.setItem("accessToken", tokens.AccessToken);
          win.localStorage.setItem("refreshToken", tokens.RefreshToken);
        },
      });
    });
  });

  //log out test user
  afterEach(() => {
    cy.visit(`${url}/tabs/user`);
    cy.window().then((win) => {
      win.localStorage.removeItem("idToken");
    });
    cy.visit(`${url}/firstpage`);
  });

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
      cy.get("#firstname").should("be.visible").type("123456789");
      cy.get("#email").should("be.visible").type("testmail.com");
      cy.get("#lastname").should("be.visible").click();
      cy.get("ion-text")
        .contains("Please fill in a valid first name.")
        .should("exist");
      cy.get("ion-text")
        .contains("Please enter a valid email address (with full domain).")
        .should("exist");
      cy.wait(sleeptime);
      cy.get("#firstname").should("be.visible").clear().type("TEST");
      cy.get("#lastname").should("be.visible").type("DELETE");
      cy.get("#email").should("be.visible").clear().type("test@mail.com");
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

    it("Can add and update an entry", () => {
      //add entry
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
      cy.get("textarea").should("be.visible").type("DELETE ME");
      cy.get("button").contains("Continue").should("be.visible").click();
      cy.get("button").contains("Confirm").should("be.visible").click();

      //update entry
      cy.visit(`${url}/tabs/entries`);
      cy.wait(sleeptime);
      cy.contains("h3", "Jan 1, 9999", { includeShadowDom: true })
        .should("exist")
        .parent()
        .within(() => {
          cy.contains("h2", "02:00", { includeShadowDom: true })
            .should("exist")
            .click({ force: true });
        });
      cy.wait(sleeptime);
      cy.get("button")
        .contains("Update")
        .should("exist")
        .click({ force: true });
      cy.get("#date")
        .should("exist")
        .type(new Date("9998-01-01").toISOString().slice(0, 16), {
          force: true,
        });
      cy.get("button")
        .contains("Confirm")
        .scrollIntoView()
        .click({ force: true });
      cy.wait(sleeptime);
      cy.visit(`${url}/tabs/inks`);
      cy.wait(sleeptime);
      cy.visit(`${url}/tabs/entries`);
      cy.wait(sleeptime);
      cy.contains("h3", "Jan 1, 9998", {
        includeShadowDom: true,
        timeout: 10000,
      }).should("exist");
    });

    it("Can delete an entry", () => {
      cy.visit(`${url}/tabs/entries`);
      cy.wait(sleeptime);
      cy.contains("h3", "Jan 1, 9998", { includeShadowDom: true })
        .should("exist")
        .parent()
        .within(() => {
          cy.contains("h2", "02:00", { includeShadowDom: true })
            .should("exist")
            .click({ force: true });
        });
      cy.wait(sleeptime);
      cy.get("button")
        .contains("Delete")
        .should("exist")
        .click({ force: true });
      cy.visit(`${url}/tabs/entries`);
      cy.contains("h3", "Jan 1, 9998", { includeShadowDom: true }).should(
        "not.exist"
      );
      cy.wait(sleeptime);
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
      cy.get('input[type="button"][value="Select"]').first().click();
      cy.wait(sleeptime);
      cy.get("button").contains("Continue").should("be.visible").click();
      cy.get("button").contains("Yes, continue").should("be.disabled");
      cy.get('input[placeholder="Insert batchnumber"]').type("test");
      cy.get("button").contains("Yes, continue").should("be.visible").click();
      cy.wait(sleeptime);
      cy.wait(sleeptime);

      //update ink
      cy.visit(`${url}/tabs/inks`);
      cy.wait(sleeptime);
      cy.wait(sleeptime);
      cy.get("p").contains("Batch: test").should("be.visible").first().click();
      cy.wait(sleeptime);
      cy.get("button")
        .contains("Update info")
        .should("be.visible")
        .first()
        .click();
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
