const { Builder, By, until } = require("selenium-webdriver");
const assert = require("node:assert/strict");

describe("Add User Feature", function () {
  this.timeout(40000);

  it("Add User Success", async function () {
    const driver = await new Builder().forBrowser("chrome").build();
    const newName = "Luthfiy";
    const newAge = "27";

    // Sign in
    await driver.get("https://belajar-bareng.onrender.com/");

    let usernameInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@data-testid='username-input']")),
      10000
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

    // Assertion Sign in
    let listUsersHeader = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'List Users')]")),
      10000
    );
    const headerText = await listUsersHeader.getText();
    assert.equal(headerText, "List Users", "Teks header tidak sesuai!");

    // Add User
    let addButton = await driver.wait(
      until.elementLocated(By.xpath("//button[@data-testid='add-button']")),
      10000
    );
    await addButton.click();

    let nameInput = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='app']/div/div/form/input[1]")),
      10000
    );

    let ageInput = await driver.findElement(
      By.xpath("//input[@data-testid='age-input']")
    );

    await nameInput.sendKeys(newName);
    await ageInput.sendKeys(newAge);

    let submitButton = await driver.findElement(
      By.xpath("//button[@data-testid='submit-button']")
    );
    await submitButton.click();

    await driver.sleep(2000);

    // Assertion
    let newUserCard = await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), '${newName}')]`)),
      15000
    );

    const addedNameText = await newUserCard.getText();

    assert.equal(
      addedNameText.includes(newName),
      true,
      `User ${newName} gagal ditambahkan ke dalam List Users!`
    );

    await driver.quit();
  });
});
