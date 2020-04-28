const puppeteer = require("puppeteer");

const screenShotfile = (file_id, callback) => {
  (async () => {
    const browser = await puppeteer.launch({
      args: ["--disable-dev-shm-usage"],
      executablePath: "/usr/bin/google-chrome",
      headless: true,
    });

    let page = await browser.newPage();
    await page.setViewport({ width: 600, height: 1080 });
    await page.goto(
      "https://stratechery.com/2020/apple-amazon-and-common-enemies/"
    );
    await page.screenshot({ path: "./stratechery.png", fullPage: true });

    await page.evaluate((_) => {
      // this will be executed within the page, that was loaded before
      console.log("test print");
      for (const a of page.querySelectorAll("*")) {
        if (a.textContent.includes("Apple, Amazon, and Common Enemies")) {
          console.log(a); //console.log(a.textContent)
        }
      }
    });
    await page.close();
    await browser.close();
    callback();
  })();
};

module.exports = {
  screenShotfile,
};
