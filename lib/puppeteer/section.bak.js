/**
 * Created by xuxin on 2018/3/28.
 */
const puppeteer = require('puppeteer');

(async function genPic (isMobile) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (isMobile) {
    await page.setViewport({
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    })
  } else {
    page.setViewport({
      width: 1200,
      height: 3000,
      deviceScaleFactor: 1
    });
  }

  if (isMobile) {
    await page.goto('https://m.xinhehui.com', {waitUntil: 'networkidle2'});
  } else {
    await page.goto('https://www.xinhehui.com', {waitUntil: 'networkidle2'});
  }

  async function screenshotDOMElement(selector, padding = 0) {
    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
    }, selector);

    console.log(rect)
    return await page.screenshot({
      path: '在贷证明.png',
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    });
  }

  if (isMobile) {
    await screenshotDOMElement('.homeBanner');
  } else {
    await screenshotDOMElement('#container');
  }

  await browser.close();
})();
