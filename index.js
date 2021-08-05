const express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
const puppeteer = require("puppeteer")
const mongo = require("./mongodb.js");
const playlist=require("./scrape-playlist");
const app = express()
app.use(express.urlencoded());
app.use(express.json());
let saavnHomepage;
let port = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/scrapeSaavn", async function(req, res) {
   saavnHomepage = await scrapeSaavn();
  console.log(`Total url from saavn ${saavnHomepage.length}`);
   mongo.deleteAllPlaylist();
  for (let i = 0; i < saavnHomepage.length; i++) {
    let playlistDetails = await playlist.scrape(saavnHomepage[i].href);
    // return res.send(playlistDetails);
  }
  res.send(`Requested accepted successfully`);
});
/**
 *  GET /users  (return all users)     app.get(/users)
 *  GET /users/user_123 (return single user) app.get(/users/:userId)
 *  DELETE /users/user_123 (delete single user) app.delete(/users/:userId)
 * 
 * 
 */

app.get("/api", async function(req, res) {
    console.log(req);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function scrapeSaavn() {
    // const browser = await puppeteer.launch({devtools: true});
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("https://www.jiosaavn.com", {
    waitUntil: 'load',
    timeout: 0
  });

  //   await delay(30000);
  console.log("Waiting.....");

  await page.waitForSelector(".c-drag");
  await page.waitForSelector(".o-block__link");
  let urlsFetched = await page.$$eval(".o-block__link", (links) => {
    // links = links.filter((link) => link.href !== '');
    const urls = links.map((link) => {
      // debugger;
        const innerHTMLOfImg = link.innerHTML;
        var wrapper = document.createElement("div");
        wrapper.innerHTML = innerHTMLOfImg;
        return { href: link.href, img: wrapper.firstElementChild.src, title: "" };
    });
    return urls;
  });
  // console.log(urlsFetched);

  let titlesObjects = await page.$$eval(".u-color-js-gray", (titles) => {
    debugger;
    let urls = titles.map((title, index) => {
      return { title: title.title };
    });
    return urls;
  });
  // console.log(titlesObjects.length);
  for (let i = 0; i < urlsFetched.length; i++) {
    urlsFetched[i].title = titlesObjects[i].title;
  }
  urlsFetched = urlsFetched.filter((url) => !!url.href);
  // console.log(urlsFetched);
  await browser.close();
  return urlsFetched;

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
};


