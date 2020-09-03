const express = require("express");
const app = express();
const port = 3000;
const amazonScraper = require("amazon-buddy");
const cors = require("cors");
const puppeteer = require("puppeteer");
const { request } = require("express");
const { element } = require("svelte/internal");
require("events").EventEmitter.defaultMaxListeners = 100;

let tf = require("@tensorflow/tfjs");

let use = require("@tensorflow-models/universal-sentence-encoder");

app.use(cors());

app.get("/", (req, res) => res.send("hello world"));

app.get("/search", async (req, res) => {
  let search = "";
  search = req.query.query;
  console.log(search);
  const getdetails_flipkart = async (url) => {
    try {
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();
      await page.goto(url);
      const body = await page.evaluate(() => {
        let word = [];
        let links = [];
        let price;
        price = document.querySelector("._1vC4OE").textContent;
        price = parseInt(price.split("₹")[1].replace(/\,/g, ""));
        if (document.querySelector("._3wU53n")) {
          document
            .querySelectorAll("._3wU53n")
            .forEach((element) => word.push(element.innerHTML));
          document
            .querySelectorAll("._31qSD5")
            .forEach((element) => links.push(element.href));
        } else {
          document
            .querySelectorAll("._2cLu-l")
            .forEach((element) => word.push(element.innerHTML));
          document
            .querySelectorAll("._2cLu-l")
            .forEach((element) => links.push(element.href));
        }
        flipkart = {
          word: word[0],
          link: links[0],
          price: price,
        };
        return flipkart;
      });

      return body;
    } catch (e) {
      console.log(e);
    }
  };
  try {
    let final = [];
    let flipkart;
    const products = await amazonScraper.products({
      keyword: search,
      number: 11,
      save: true,
      host: "www.amazon.in",
    });
    for (let i = 0; i < products.result.length; i++) {
      let x = {};
      url_flipkart = `https://www.flipkart.com/search?q=${products.result[i].title}`;
      flipkart = await getdetails_flipkart(url_flipkart);
      console.log(flipkart);
      x["amazon"] = products.result[i];
      x["flipkart"] = flipkart;
      final.push(x);
    }
    res.status(200).json(final);
  } catch (error) {
    console.log(error);
    res.status(400).json({ Error: error.message });
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
