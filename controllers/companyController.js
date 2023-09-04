import { Page } from "puppeteer";

const IMPRESSIONS_QUESTION = 'What did you find most impressive or unique about this company?';
const IMPROVEMENT_QUESTION = 'Are there any areas for improvement or something they could have done differently?';

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
    const articleData = {};
    // Clients’ name
    articleData.clientName = await extractClientName(page, article);
    // Clients’ location
    articleData.location = await extractClientLocation(page, article);

    // Toggle Read Full Review button before precess the data from the reviews
    await handleReadFullReviewBtn(page, article);

    const extraSectionContent = await article.$(
      ".profile-review__extra > section.profile-review__extra-content"
    );
  
    if (extraSectionContent) {
      const clientIntroduction = await extractClientIntroduction(extraSectionContent);

      // Introduce your business and what you do there.
      articleData.introduction =  clientIntroduction.introduction;
      articleData.whatClientDo = clientIntroduction.whatClientDo;

      // What did you find most impressive or unique about this company?
      articleData.impressiveness = await extractClientImpressions(extraSectionContent);

      // Are there any areas for improvement or something they could have done differently?
      articleData.improvement = await extractClientImprovement(extraSectionContent);
    }

    companyData.push(articleData);
  }

  console.log('companyData', companyData)

  return companyData;
};

const handleReadFullReviewBtn = async (page, article) => {
  const readFullReviewBtn = await page.evaluate((element) => {
    return element.querySelector(
      "button.profile-review__button.profile-review__button--main.review-card-show-more"
    );
  }, article);

  readFullReviewBtn?.click?.();
};

const extractClientLocation = async (page, article) => {
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

const extractClientName = async (page, article) => {
  return await page.evaluate((element) => {
    const h4Element = element.querySelector(".profile-review__header > h4");

    return h4Element ? h4Element.textContent : "";
  }, article);
};

const extractClientIntroduction = async (extraSectionContent) => {
  return await extraSectionContent.$eval('div[data-link-text="Background"]', (ele) => {
    const paragraphs = Array.from(
      ele.querySelectorAll(":scope > *:not(h5.profile-review__extra-title)")
    );

    let introduction = paragraphs?.[1]?.textContent?.trim?.() || '';
    let whatClientDo = '';

    if (paragraphs.length > 3) {
      if (paragraphs[3].tagName === 'UL') {
        const liElements = paragraphs[3].querySelectorAll("li");
        const contentArray = Array.from(liElements).map((liElement) => {
          let liText = liElement.textContent.trim();
          // Kiểm tra nếu cuối chuỗi không chứa dấu chấm thì thêm vào
          if (!liText.endsWith(".")) {
            liText += ".";
          }
          return liText;
        });
        whatClientDo = contentArray.join(" ");
      } else {
        whatClientDo = paragraphs[3].textContent.trim();
      }
    }
  
    return { introduction, whatClientDo };
  });
};

const extractClientImpressions = async (extraSectionContent, question = IMPRESSIONS_QUESTION) => {
  return await extraSectionContent.$eval('div[data-link-text="Results"]', (ele, question) => {
    const paragraphs = Array.from(ele.querySelectorAll("p"));
    const startIdx = paragraphs.findIndex((p) =>
      p.querySelector("strong")?.textContent?.includes(question)
    );

    if (startIdx !== -1 && startIdx + 1 < paragraphs.length) {
      return paragraphs[startIdx + 1].textContent.trim();
    }
    return "";
  }, question);
};

const extractClientImprovement = async (extraSectionContent) => {
  return await extractClientImpressions(extraSectionContent, IMPROVEMENT_QUESTION);
}

export default handleCrawlingCompany;
