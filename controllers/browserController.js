import puppeteer, { Browser, executablePath } from "puppeteer";

/**
 * Handle launch pupperteer in virtual browser
 * @returns {Browser} Browser
 */
export const startBrowser = async () => {
  let browser;
  const mode =
    process?.argv?.find((arg) => arg?.startsWith("--mode=")) ? "new" : false;
  const browserPath = process.env.BROWSER_EXECUTABLE_PATH;
  const puppeteerLaunchOptions = {
    headless: mode,
    args: [
      "--enable-features=NetworkService",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--disable-features=site-per-process",
    ],
    ignoreHTTPSErrors: true,
    // slowMo: 100,
  }

  if (browserPath) {
    puppeteerLaunchOptions.executablePath = browserPath;
  }

  try {
    browser = await puppeteer.launch(puppeteerLaunchOptions);
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
  await page.setCookie({ name: 'your_cookie_name', value: 'your_cookie_value', domain: url });
  await page.goto(url);
  return { browser, page };
};
