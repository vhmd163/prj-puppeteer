import { Page } from "puppeteer";
import handleCrawlingCompany from "./companyController.js";
import { openUrlInNewBrowser } from "./browserController.js";

/**
 * Handle crawling data for a page
 * @param {Page} page Pupperteer page instance
 * @param {string} url Page url
 * @returns {Array} pageData
 */
const handleCrawlingPage = async (page, url) => {
  const pageData = [];

  if (page && url) {
    await page.goto(url);
    await page.waitForSelector(".directory-list");
    const ulElement = await page.$(".directory-list");

    if (ulElement) {
      const providerElements = await ulElement.$$(".provider");

      for (const providerElement of providerElements) {
        const viewProfileElement = await providerElement.$(
          ".company_logotype.directory_profile",
        );
        // To avoid checking if the site connection is secure,
        // We need to open a new brower for each company
        if (viewProfileElement) {
          const companyUrl = await (
            await viewProfileElement.getProperty("href")
          ).jsonValue();

          const { page: companyPage, browser: companyBrowser } =
            await openUrlInNewBrowser(companyUrl);
          const companyData = await handleCrawlingCompany(companyPage);

          if (companyData) {
            pageData.push(companyData);
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

  return pageData;
};

export default handleCrawlingPage;
