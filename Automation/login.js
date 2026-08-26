const { Builder, By, until } = require("selenium-webdriver");
const assert = require("node:assert/strict");

describe("Sign in Feature", function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    console.log("🚀 STARTING: Sign in Feature Test Suite");
  });

  after(async function () {
    console.log("✅ COMPLETED: Sign in Feature Test Suite");
  });

  beforeEach(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://belajar-bareng.onrender.com/");
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  // --- POSITIVE CASES ---
  describe("Positive Cases", function () {
    it("Sign in Success with valid credentials", async function () {
      await driver
        .findElement(By.xpath("//input[@data-testid='username-input']"))
        .sendKeys("admin");
      await driver
        .findElement(By.xpath("//input[@data-testid='password-input']"))
        .sendKeys("admin");
      await driver
        .findElement(By.xpath("//button[@data-testid='login-button']"))
        .click();

      let listUsersHeader = await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(), 'List Users')]")),
        30000
      );

      const headerText = await listUsersHeader.getText();
      assert.equal(headerText, "List Users", "Teks header tidak sesuai!");
    });
  });

  // --- NEGATIVE CASES ---
  describe("Negative Cases", function () {
    it("Sign in Failed with invalid password", async function () {
      await driver
        .findElement(By.xpath("//input[@data-testid='username-input']"))
        .sendKeys("admin");
      await driver
        .findElement(By.xpath("//input[@data-testid='password-input']"))
        .sendKeys("wrong_password");
      await driver
        .findElement(By.xpath("//button[@data-testid='login-button']"))
        .click();

      let errorMessage = await driver.wait(
        until.elementLocated(By.xpath("//*[@id='error-login']")),
        60000
      );

      await driver.sleep(1000);

      let toastContent = await errorMessage.findElement(
        By.xpath(".//*[@data-testid='toast-content']")
      );

      const errorText = await toastContent.getText();

      assert.strictEqual(
        errorText,
        "Invalid username or password!",
        "Pesan error tidak sesuai!"
      );
    });

    it("Sign in Failed with empty fields", async function () {
      let usernameInput = await driver.findElement(
        By.xpath("//input[@data-testid='username-input']")
      );
      let signinButton = await driver.findElement(
        By.xpath("//button[@data-testid='login-button']")
      );

      await signinButton.click();

      const validationMessage = await usernameInput.getAttribute(
        "validationMessage"
      );

      assert.strictEqual(
        validationMessage,
        "Please fill out this field.",
        "Pesan tooltip validasi HTML5 tidak sesuai!"
      );

      let currentUrl = await driver.getCurrentUrl();
      assert.strictEqual(
        currentUrl,
        "https://belajar-bareng.onrender.com/",
        "User tidak boleh redirect saat form kosong!"
      );
    });
  });
});
