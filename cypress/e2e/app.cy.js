/* describe("Ionic Tabs Navigation", () => {
  beforeEach(() => {
    cy.visit("/tabs/mainpage"); // Adjust if your app redirects elsewhere
  });

  it("should navigate to Inks tab and show correct content", () => {
    // Click the tab using its label
    cy.contains("ion-tab-button", "Inks").click();

    // Verify URL changed
    cy.url().should("include", "/tabs/inks");

    // Optionally check for content specific to the Inks tab
    cy.contains("Inks").should("be.visible");
  });

  it("should navigate to Customers tab", () => {
    cy.contains("ion-tab-button", "Customers").click();
    cy.url().should("include", "/tabs/customers");
    cy.contains("Customers").should("be.visible");
  });
});
 */
