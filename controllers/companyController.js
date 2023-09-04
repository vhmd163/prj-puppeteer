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
      // Introduce your business and what you do there.
      clientName: clientName,
      // Clients’ location
      location: locationData,
      // Introduce your business and what you do there.
      ...profileSectionData,
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
    return await extraSectionContent.$eval('div[data-link-text="Background"]',
      (ele) => {
        const paragraphs = Array.from(
          ele.querySelectorAll(":scope > *:not(h5.profile-review__extra-title)")
        );
  
        let introduction = '';
        let whatClientDo = '';
  
        for (let i = 1; i < paragraphs.length; i += 2) {
          const paragraph = paragraphs[i];
          if (paragraph.tagName === 'UL') {
            const liElements = paragraph.querySelectorAll("li");
            const content = Array.from(liElements)
              .filter((li) => !li.textContent.includes(":maker"))
              .map((liText) => (liText.endsWith(".") ? liText : liText + "."));

            if (content.length > 0) {
              if (!introduction) {
                introduction = content.join(" ");
              } else {
                whatClientDo = content.join(" ");
              }
            }
          } else {
            if (!introduction) {
              introduction = paragraph.textContent.trim();
            } else {
              whatClientDo = paragraph.textContent.trim();
            }
          }
        }
  
        return {
          introduction: introduction,
          whatClientDo: whatClientDo,
        };
      }
    );

  }

  return {
    introduction: '',
    whatClientDo: '',
  };
};

export default handleCrawlingCompany;
