const puppeteer = require('puppeteer');

(async () => {
  // Tạo một đối tượng trình duyệt mới.
  const browser = await puppeteer.launch();

  // Mở một trang web trong trình duyệt.
  const page = await browser.newPage();

  // Truy cập trang web Wikipedia về Google.
  await page.goto('https://en.wikipedia.org/wiki/Google');

  // Sử dụng phương thức evaluate để truy cập các phần tử của trang web.
  const name = await page.evaluate(() => document.querySelector('#siteSub').textContent);

  // Đóng trình duyệt.
  await browser.close();

  // In dữ liệu.
  console.log(name);
})();