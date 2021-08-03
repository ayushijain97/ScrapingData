const express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
const puppeteer = require("puppeteer")
const mongo = require("./mongodb.js");
const app = express()
app.use(express.urlencoded());
app.use(express.json());
let port = process.env.PORT || 3000
let users = []; // Empty database
// let port = 3000;
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/data/:title", async function(req, res) {
  // const data = await mongo.fetchData(req.params.title);
  // res.send(data);
  let data = await scrapeSaavn();
  // console.log(data);
  return res.send(data);
});

// Get single user by id
app.get("/users/:userName", async function (req, res) {
  const user= await mongo.getUser(req.params.userName);
   return res.send(user);
});

// Get all users
app.get("/users", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  return res.send(JSON.stringify(users));
});

app.post("/users", async function (req, res) {
  console.log("Creating user", req.body);
  users.push(req.body);
   await mongo.createUser(req.body);
  res.send("User Created successfully "+ users.length);
});

app.delete("/users/:userId", async function (req, res) {
  const userId = req.params.userId - 1;
  users.splice(userId, 1);
  console.log("User deleted successfully");
  res.send();
});

app.put("/users/:userId", async function (req, res) {
  const userId = req.params.userId - 1;
  const updatedUser = req.body;
  console.log(`Updating ${users[userId]} with ${updatedUser}`);
  users[userId] = updatedUser;
  res.send();
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
  // const browser = await puppeteer.launch();

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


