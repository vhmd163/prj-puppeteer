import dotenv from "dotenv";
import startBrowser from "./browser.js";
import { exportToExcel, createWorkbook, createWorksheet } from "./exportExcel.helper.js";

dotenv.config(); // Load environment variables from .env file

const main = async () => {
  const urls = process.env.PAGE_URLS.split(", ") || [];
  const workbook = createWorkbook();
  try {
    for (const url of urls) {
      console.log("Start crawling ", url);
      const browser = await startBrowser();
      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector(".directory-list");
      const ulElement = await page.$(".directory-list");
      const links = ["Links"];

      if (ulElement) {
        const providerElements = await ulElement.$$(".provider");

        for (const providerElement of providerElements) {
          const viewProfileElement = await providerElement.$(
            ".website-profile",
          );

          if (viewProfileElement) {
            const hrefValue = await viewProfileElement.$eval('a', (a) => a.getAttribute('href'));
            links.push(process.env.DOMAIN_NAME + hrefValue);
          }
        }
      } else {
        console.log("UL element not found");
      }

      const urlParts = url.split("/");
      const workSheetName = urlParts[urlParts.length - 1];
      await createWorksheet(workbook, workSheetName, links);
      // for (const link of links) {
      //   //do something
      // }
      await page.close();
      await browser.close();
    }

    await exportToExcel(workbook, 'data');
  } catch (error) {
    console.error("An error occurred:", error);
  }
  console.log("End the process.")
};

main();
