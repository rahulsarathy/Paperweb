const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--disable-dev-shm-usage'],
    executablePath: '/usr/bin/google-chrome-unstable'
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2
  });
  await page.goto('file:///usr/src/app/stratechery.html', {
    waitUntil: "networkidle2"
  });
  await page.pdf({
    path: "output.pdf",
    // pageRanges: "1",
    format: "A4",
    printBackground: true
  });

  await browser.close();

})();
