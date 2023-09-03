import { Page } from "puppeteer";

/**
 * Handle for crawling data for a company
 * @param {Page} page
 * @returns {Array} companyData
 */
const handleCrawlingCompany = async (page) => {
  let companyData = [];

  if (page) {
    // Todo: will implement for pagination later
    const articles = await page.$$('div#reviews-list article') || [];

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
  
      const locationData = await page.evaluate(element => {
        const liElement = element.querySelector('li[data-tooltip-content="<i>Location</i>"]');
        if (liElement) {
          const titleElement = liElement.querySelector('.reviewer_list__details-title.sg-text__title');
          return titleElement ? titleElement.textContent : null;
        }
        return null;
      }, article);
  
      if (locationData) {
        companyData[i] = {
          location: locationData
        }
      }
    }
  } else {
    console.log("The Company page instance got some errors !!");
  }

  return companyData;
};

export default handleCrawlingCompany;
