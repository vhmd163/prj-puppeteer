import { Page } from "puppeteer";

/**
 * Handle for crawling data for a company
 * @param {Page} page
 * @returns {Array} companyData
 */
const handleCrawlingCompany = async (page) => {
  const companyData = {};

  if (page) {
    companyData.profile = await handleProfileSection(page);
  } else {
    console.log("The Company page instance got some errors !!");
  }

  return companyData;
};

const handleProfileSection = async (page) => {
  const profileSection = await page.$(".profile_content");
  const location = await getCompanyLocation(profileSection) || '';

  return {
    location
  }
};

const getCompanyLocation = async (parentEle) => {
  const companyLocaltion = await parentEle.$("#locations_section");
  const showLocationButton = await companyLocaltion.$("#location_0");
  await showLocationButton.click();

  const addressElement = await companyLocaltion.$("address.detailed-address");
  const streetAddress = await addressElement.$eval(
    'span[itemprop="streetAddress"]',
    (span) => span.textContent.trim(),
  );
  const addressLocality = await addressElement.$eval(
    'span[itemprop="addressLocality"]',
    (span) => span.textContent.trim(),
  );
  const addressCountry = await addressElement.$eval(
    'span[itemprop="addressCountry"]',
    (span) => span.textContent.trim(),
  );

  return `${streetAddress}\n${addressLocality}, ${addressCountry}`;
};

export default handleCrawlingCompany;
