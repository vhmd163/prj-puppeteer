import dotenv from "dotenv";
import { startBrowser } from "./controllers/browserController.js";
import handleCrawlingPage from "./controllers/pageController.js";
import { exportToExcel, createWorkbook, createWorksheet } from "./exportExcel.helper.js";

dotenv.config(); // Load environment variables from .env file

const main = async () => {
  const urls = process.env.PAGE_URLS.split(", ") || [];
  // const workbook = createWorkbook();
  try {
    for (const url of urls) {
      console.log("Start crawling ", url);
      const browser = await startBrowser();
      const page = await browser.newPage();

      const crawledPageData = await handleCrawlingPage(page, url);

      const urlParts = url.split("/");
      const workSheetName = urlParts[urlParts.length - 1];
      await createWorksheet(workbook, workSheetName, crawledPageData);

      await browser.close();
    }

    // await exportToExcel(workbook, 'data');
  } catch (error) {
    console.error("An error occurred:", error);
  }
  console.log("End the process.");
};

main();
