const { Builder, By, until } = require("selenium-webdriver");
const assert = require("node:assert/strict");

describe("Add User Feature", function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    console.log("🚀 STARTING: Add User Feature Test Suite");
  });

  after(async function () {
    console.log("✅ COMPLETED: Add User Feature Test Suite");
  });

  beforeEach(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://belajar-bareng.onrender.com/");

    await driver
      .findElement(By.xpath("//input[@data-testid='username-input']"))
      .sendKeys("admin");
    await driver
      .findElement(By.xpath("//input[@data-testid='password-input']"))
      .sendKeys("admin");
    await driver
      .findElement(By.xpath("//button[@data-testid='login-button']"))
      .click();

    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'List Users')]")),
      10000
    );
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  // --- POSITIVE CASES ---
  describe("Positive Cases", function () {
    it("Add User Success with valid data", async function () {
      let addButton = await driver.wait(
        until.elementLocated(By.xpath("//button[@data-testid='add-button']")),
        10000
      );
      await addButton.click();

      await driver
        .findElement(By.xpath("//input[@data-testid='username-input']"))
        .sendKeys("Luthfiy");

      await driver
        .findElement(By.xpath("//input[@data-testid='age-input']"))
        .sendKeys("27");

      await driver
        .findElement(By.xpath("//button[@data-testid='submit-button']"))
        .click();

      let newUserCard = await driver.wait(
        until.elementLocated(By.xpath("//*[@id='success-added']")),
        60000
      );

      await driver.sleep(1000);

      let toastContent = await newUserCard.findElement(
        By.xpath(".//*[@data-testid='toast-content']")
      );

      const addedNameText = await toastContent.getText();

      assert.equal(
        addedNameText,
        "User successfully added, Hi Luthfiy!",
        "User Luthfiy gagal ditambahkan ke dalam List Users!"
      );
    });
  });

  // --- NEGATIVE CASES ---
  describe("Negative Cases", function () {
    it("Add User Failed with empty fields", async function () {
      let addButton = await driver.wait(
        until.elementLocated(By.xpath("//button[@data-testid='add-button']")),
        10000
      );
      await addButton.click();

      let usernameInput = await driver.wait(
        until.elementLocated(
          By.xpath("//input[@data-testid='username-input']")
        ),
        10000
      );

      let submitButton = await driver.findElement(
        By.xpath("//button[@data-testid='submit-button']")
      );

      await submitButton.click();

      const validationMessage = await usernameInput.getAttribute(
        "validationMessage"
      );

      assert.strictEqual(
        validationMessage,
        "Please fill out this field.",
        "Pesan tooltip validasi Add User tidak sesuai!"
      );
    });
  });
});
