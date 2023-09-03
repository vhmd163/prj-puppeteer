import { Page } from "puppeteer";

/**
 * Handle for crawling data for a company
 * @param {Page} page
 */
const handleCrawlingCompany = async (page) => {
  if (page) {
    await handleProfileSection(page);
  } else {
    console.log("The Company page instance got some errors !!");
  }
};

const handleProfileSection = async (page) => {
  const profileSection = await page.$(".profile_content");
  await getCompanyLocation(profileSection);
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

  const formattedAddress = `${streetAddress}\n${addressLocality}, ${addressCountry}`;
  console.log("formattedAddress", formattedAddress);
};

export default handleCrawlingCompany;
