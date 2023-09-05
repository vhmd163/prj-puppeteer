import puppeteer, { Browser } from "puppeteer";
import userAgent from "user-agents";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

/**
 * Handle launch pupperteer in virtual browser
 * @returns {Browser} Browser
 */
export const startBrowser = async () => {
  let browser;
  const mode = process?.argv?.find((arg) => arg?.startsWith("--mode="))
    ? "new"
    : false;
  const browserPath = process.env.BROWSER_EXECUTABLE_PATH;
  const puppeteerLaunchOptions = {
    headless: mode,
    args: [
      "--enable-features=NetworkService",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
    ],
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    ignoreHTTPSErrors: true,
    // slowMo: 100,
  };

  if (browserPath) {
    puppeteerLaunchOptions.executablePath = puppeteer.executablePath();
  }

  try {
    puppeteerExtra.use(StealthPlugin());
    browser = await puppeteerExtra.launch(puppeteerLaunchOptions);
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
  await page.setUserAgent(userAgent.random().toString());
  await page.goto(url);
  return { browser, page };
};
