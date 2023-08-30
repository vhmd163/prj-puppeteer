import puppeteer from 'puppeteer';

const startBrowser = async () => {
  let browser;

  try {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
      // slowMo: 100,
    });
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }

  return browser;
};

export default startBrowser;