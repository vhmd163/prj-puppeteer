import { Page } from "puppeteer";

/**
 * Handle for crawling data for a company
 * @param {Page} page
 * @returns {Array} companyData
 */
const handleCrawlingCompany = async (page) => {
  if (!page) {
    console.log("The Company page instance has some errors!!");
    return [];
  }

  const articles = await page.$$("div#reviews-list article") || [];
  const companyData = [];

  for (const article of articles) {
    const clientName = await getClientName(page, article);
    const locationData = await getClientLocation(page, article);
    await handleReadFullReviewBtn(page, article);
    const profileSectionData = await handleReviewProfileSection(article);

    companyData.push({
      clientName: clientName,
      location: locationData,
      profileSectionData: profileSectionData,
    });
  }

  return companyData;
};

const getClientLocation = async (page, article) => {
  return await page.evaluate((element) => {
    const liElement = element.querySelector(
      'li[data-tooltip-content="<i>Location</i>"]'
    );

    if (liElement) {
      const titleElement = liElement.querySelector(
        ".reviewer_list__details-title.sg-text__title"
      );

      return titleElement ? titleElement.textContent : "";
    }

    return null;
  }, article);
};

const getClientName = async (page, article) => {
  return await page.evaluate((element) => {
    const h4Element = element.querySelector(".profile-review__header > h4");

    return h4Element ? h4Element.textContent : "";
  }, article);
};

const handleReadFullReviewBtn = async (page, article) => {
  const readFullReviewBtn = await page.evaluate((element) => {
    return element.querySelector(
      "button.profile-review__button.profile-review__button--main.review-card-show-more"
    );
  }, article);

  readFullReviewBtn?.click?.();
};

const handleReviewProfileSection = async (article) => {
  const extraSectionContent = await article.$(
    ".profile-review__extra > section.profile-review__extra-content"
  );

  if (extraSectionContent) {
    const clientPosition = await extraSectionContent.$eval(
      "h5.profile-review__extra-title",
      (titleElement) => {
        const paragraphs = Array.from(
          titleElement.parentElement.querySelectorAll("p")
        );
        if (paragraphs.length > 1) {
          const secondParagraph = paragraphs[1].textContent.trim();
          const cleanedText = secondParagraph.replace(/^I am\s+/i, "");

          return cleanedText;
        }
        return "";
      }
    );

    return {
      clientPosition: clientPosition,
    };
  }

  return null;
};

export default handleCrawlingCompany;
