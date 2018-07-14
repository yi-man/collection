/**
 * Created by xuxin on 2018/3/28.
 */
const puppeteer = require('puppeteer');

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
  await page.goto('https://m.xinhehui.com/#/invest', {waitUntil: 'networkidle2'});
  //默认 800*600
  await page.screenshot({path: 'mxhh.png'});
  // await page.pdf({path: 'mxhh.pdf', format: 'A4'});

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  const dimensions = await page.evaluate(() => {
    console.log(`url is ${location.href}`)
    console.log(document)
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('Dimensions:', dimensions);

  await browser.close();
})();
