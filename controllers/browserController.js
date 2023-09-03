import puppeteer, { Browser } from "puppeteer";

/**
 * Handle launch pupperteer in virtul browser
 * @returns {Browser} Browser
 */
export const startBrowser = async () => {
  let browser;
  const mode =
    !!process?.argv?.find((arg) => arg.startsWith("--mode=")) || false;

  try {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
      headless: mode,
      args: ["--disable-setuid-sandbox", "--ignore-certificate-errors"],
      ignoreHTTPSErrors: true,
      // slowMo: 100,
    });
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }

  return browser;
};

/**
 * Open a URL in a new browser and return the page instance
 * @param {string} url Page URL to open
 */
export const openUrlInNewBrowser = async (url) => {
  const browser = await startBrowser();
  const page = await browser.newPage();
  await page.goto(url);
  return { browser, page };
};
