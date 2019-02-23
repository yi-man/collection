/**
 * Created by xuxin on 2018/3/28.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');



(async (isMobile) => {
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
    await page.setViewport({
      width: 1200,
      height: 3000,
      deviceScaleFactor: 1
    });
  }

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

  var arr = ['/', '/Financing/Invest/plist']


  let count = 0
  let time = (new Date()).getTime()
  for (let i of arr) {
    count++
    let url = i
    try {

      if (isMobile) {
        await page.goto('https://m.xinhehui.com', { waitUntil: 'networkidle2' });
      } else {
        await page.goto(`https://www.xinhehui.com${url}`, { waitUntil: 'networkidle2' });
      }

      if (isMobile) {
        await screenshotDOMElement('.homeBanner', count);
      } else {
        await screenshotDOMElement('#container', count);
      }
    } catch (e) {
      fs.appendFileSync(`./error.${time}.txt`, `${url},`);
    }
  }

  await browser.close();
})();
