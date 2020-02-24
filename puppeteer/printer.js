const puppeteer = require('puppeteer');

const printFile = (file_id, callback) => {
  (async () => {
    const browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage'],
      executablePath: '/usr/bin/google-chrome'
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
    });
    let file_string = 'file:///usr/src/app/dump/' + file_id + '.html';
    await page.goto(file_string, {
      waitUntil: "networkidle2"
    });
    let path = 'dump/' + file_id + '.pdf';
    await page.pdf({
      path: path,
      // pageRanges: "1",
      format: "A4",
      displayHeaderFooter: true,
      printBackground: true,
      margin: {
        bottom: 100, // minimum required for footer msg to display
        left: 25,
        right: 35,
        top: 30,
      },
      footerTemplate: `
          <div style="color: lightgray; border-top: solid lightgray 1px; font-size: 10px; padding-top: 5px; text-align: center; width: 100%;">
            <span class="pageNumber"></span>
          </div>
        `,
    });

    await browser.close();
    callback();
  })();
}

module.exports = {
  printFile
};
