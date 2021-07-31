const puppeteer = require("puppeteer");

(async () => {
//   const browser = await puppeteer.launch({devtools: true});
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("https://www.jiosaavn.com");

//   await delay(30000);
  console.log("Waiting.....");

  await page.waitForSelector(".c-drag");
  await page.waitForSelector(".o-block__link");
  let urlsFetched = await page.$$eval(".o-block__link", (links) => {
    const urls = links.map((link) => {
        // debugger;
        const innerHTMLOfImg = link.innerHTML;
        var wrapper= document.createElement('div');
        wrapper.innerHTML = innerHTMLOfImg;
        return {href: link.href, img: wrapper.firstElementChild.src, title: ''};
    });
    return urls;
  });

  console.log(urlsFetched);

  let titlesObjects = await page.$$eval(".u-color-js-gray", (titles) => {
    let urls = titles.map((title, index) => {
      return {title: title.title };
    });
    return urls;
  });
  console.log(titlesObjects.length);
  for (let i = 0; i < urlsFetched.length; i++) {
    urlsFetched[i].title = titlesObjects[i].title;
  }

  console.log(urlsFetched);
  
  await browser.close();

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
})();


