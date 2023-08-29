import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import startBrowser from './browser.js';

dotenv.config(); // Load environment variables from .env file

const main = async () => {
  const urls = process.env.PAGE_URLS.split(", ") || [];
  const browser = await startBrowser();

  try {
    for (const url of urls) {
      console.log('Start crawling ', url);
      const page = await browser.newPage();
      await page.goto(url);

      const companyName = await page.evaluate(() => {
        const company = document.querySelector('.company_title.directory_profile');
        return company?.textContent?.trim();
      });

      console.log('Company name', companyName);

      await page.close();
    }

    await browser.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main();
