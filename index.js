import puppeteer from "puppeteer";
import dotenv from "dotenv";
import startBrowser from "./browser.js";

dotenv.config(); // Load environment variables from .env file

const main = async () => {
  const urls = process.env.PAGE_URLS.split(", ") || [];
  const browser = await startBrowser();

  try {
    for (const url of urls) {
      console.log("Start crawling ", url);
      const browser = await startBrowser();
      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector(".directory-list");
      const ulElement = await page.$(".directory-list");

      if (ulElement) {
        const providerElements = await ulElement.$$(".provider");

        for (const providerElement of providerElements) {
          const aElement = await providerElement.$(
            ".company_title.directory_profile",
          );

          if (aElement) {
            const companyName = await aElement.evaluate((element) =>
              element.textContent.trim(),
            );
            console.log(companyName);
          }
        }
      } else {
        console.log("UL element not found");
      }

      await page.close();
      await browser.close();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

main();
