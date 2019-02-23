/**
 * Created by xuxin on 2018/3/28.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');

var arr = ['/', '/Financing/Invest/plist']

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  })

  async function screenshotDOMElement(selector, index) {
    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);

    // console.log(rect)
    return await page.screenshot({
      path: `zaidai.${index}.png`,
      clip: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      }
    });
  }

  let count = 0
  let time = (new Date()).getTime()
  for (let i of arr) {
    count++
    let url = i
    try {
      await page.goto('https://m.xinhehui.com', { waitUntil: 'networkidle2' });

      await screenshotDOMElement('.homeBanner', count);
    } catch (e) {
      fs.appendFileSync(`./error.${time}.txt`, `${url},`);
    }
  }

  await browser.close();
})();
