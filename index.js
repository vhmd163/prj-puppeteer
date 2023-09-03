import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { startBrowser } from "./controllers/browserController.js";
import handleCrawlingPage from "./controllers/pageController.js";

dotenv.config(); // Load environment variables from .env file

const main = async () => {
  const urls = process.env.PAGE_URLS.split(", ") || [];
  try {
    for (const url of urls) {
      console.log("Start crawling ", url);
      const browser = await startBrowser();
      const page = await browser.newPage();

      await handleCrawlingPage(page, url);

      await browser.close();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
  console.log("End the process.");
};

main();
