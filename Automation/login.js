const { Builder, By, until } = require("selenium-webdriver");
const assert = require("node:assert/strict");

describe("Sign in Feature", function () {
  it("Sign in Success", async function () {
    const driver = await new Builder().forBrowser("chrome").build();

    await driver.get("https://belajar-bareng.onrender.com/");

    let usernameInput = await driver.findElement(
      By.xpath("//input[@data-testid='username-input']")
    );

    let passwordInput = await driver.findElement(
      By.xpath("//input[@data-testid='password-input']")
    );

    let signinButton = await driver.findElement(
      By.xpath("//button[@data-testid='login-button']")
    );

    await usernameInput.sendKeys("admin");
    await passwordInput.sendKeys("admin");
    await signinButton.click();

    // Assertion

    let listUsersHeader = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'List Users')]")),
      30000
    );

    const headerText = await listUsersHeader.getText();

    assert.equal(headerText, "List Users", "Teks header tidak sesuai!");

    await driver.quit();
  });
});
