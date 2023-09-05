import { Page } from "puppeteer";
import handleCrawlingCompany from "./companyController.js";
import { openUrlInNewBrowser } from "./browserController.js";
import {
  createWorkbook,
  exportToExcel,
  createWorksheet,
} from "../helper/exportExcel.js";

/**
 * Handle crawling data for a page
 * @param {Page} page Puppeteer page instance
 * @param {string} url Page url
 * @returns {Array} pageData
 */
const handleCrawlingPage = async (page, url) => {
  if (page && url) {
    await page.goto(url);
    await page.waitForSelector(".directory-list");
    const ulElement = await page.$(".directory-list");
    const urlParts = url.split("/");
    const pageName = urlParts[urlParts.length - 1];

    if (ulElement) {
      const providerElements = await ulElement.$$(".provider");

      for (const providerElement of providerElements) {
        const viewProfileElement = await providerElement.$(
          '.directory_profile[data-link_text="Profile Button"]',
        );
        // To avoid checking if the site connection is secure,
        // We need to open a new browser for each company
        if (viewProfileElement) {
          const companyUrl = await (
            await viewProfileElement.getProperty("href")
          ).jsonValue();

          const { page: companyPage, browser: companyBrowser } =
            await openUrlInNewBrowser(companyUrl);
          const companyData = await handleCrawlingCompany(companyPage);

          const companyNameElement = await providerElement.$(".company_info");

          if (companyData && companyNameElement) {
            const workbook = createWorkbook();
            const companyName = await companyNameElement.evaluate((element) =>
              element.textContent.trim(),
            );
            await createWorksheet(workbook, "data", companyData);
            await exportToExcel(workbook, companyName, pageName);
            console.log("Crawled ", companyName);
          }
          await companyPage.close();
          await companyBrowser.close();
        }
      }
    } else {
      console.log("UL element not found");
    }

    await page.close();
  } else {
    console.log("The Main Page instance got some error or the URL is invalid");
  }
};

export default handleCrawlingPage;
