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

      const clientName = await getClientName(page, article);
      const locationData = await getClientLocation(page, article);

      companyData[i] = {
        clientName: clientName,
        location: locationData,
      }
    }
  } else {
    console.log("The Company page instance got some errors !!");
  }

  return companyData;
};


/**
 * @param {Page} page
 * @param {ElementHandle<HTMLElement>} article
 * @returns {string} clientLocation
 */
const getClientLocation =  async (page, article) => {
   return await page.evaluate(element => {
    const liElement = element.querySelector('li[data-tooltip-content="<i>Location</i>"]');

    if (liElement) {
      const titleElement = liElement.querySelector('.reviewer_list__details-title.sg-text__title');

      return titleElement ? titleElement.textContent : '';
    }

    return null;
  }, article);
};

/**
 * @param {Page} page
 * @param {ElementHandle<HTMLElement>} article
 * @returns {string} clientName
 */
const getClientName = async (page, article) => {
  return await page.evaluate(element => {
    const h4Element = element.querySelector('.profile-review__header > h4');

    return h4Element ? h4Element.textContent : '';
  }, article);
}

export default handleCrawlingCompany;
