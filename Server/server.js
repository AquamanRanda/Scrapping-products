const express = require("express");
const app = express();
const port = 3000;
const amazonScraper = require("amazon-buddy");
const cors = require("cors");
const puppeteer = require("puppeteer");
const { request } = require("express");
const { element } = require("svelte/internal");
const score = require("./score");
require("events").EventEmitter.defaultMaxListeners = 100;

app.use(cors());

app.get("/", (req, res) => res.send("hello world"));

app.get("/search", async (req, res) => {
  let search = "";
  search = req.query.query;
  search = search.replace(/ /g, "+");
  console.log(search);
  list_sentences = [
    "Realme 5i (Forest Green, 4GB RAM, 128GB Storage)",
    "Realme 5i (Aqua Blue, 4GB RAM, 64GB Storage)",
  ];
  let sim_score;
  try {
    sim_score = await score.sim_score(list_sentences);
    console.log(sim_score);
  } catch (error) {
    console.log(error);
  }
  const getdetails_flipkart = async (url) => {
    try {
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();
      await page.goto(url);
      const body = await page.evaluate(() => {
        let word = [];
        let links = [];
        let prices = [];
        let flipkart;
        document
          .querySelectorAll("._1vC4OE ")
          .forEach((element) => prices.push(element.innerText));
        if (document.querySelector("._3wU53n")) {
          document
            .querySelectorAll("._3wU53n")
            .forEach((element) => word.push(element.innerHTML));
          document
            .querySelectorAll("._31qSD5")
            .forEach((element) => links.push(element.href));
        } else if (document.querySelector("_2mylT6")) {
          document
            .querySelectorAll("._2mylT6")
            .forEach((element) => word.push(element.innerHTML));
          document
            .querySelectorAll("._2mylT6")
            .forEach((element) => links.push(element.href));
        } else {
          document
            .querySelectorAll("._2cLu-l")
            .forEach((element) => word.push(element.innerHTML));
          document
            .querySelectorAll("._2cLu-l")
            .forEach((element) => links.push(element.href));
        }
        return { word, links, prices };
      });

      return body;
    } catch (e) {
      console.log(e);
    }
  };
  try {
    let final = [];
    let products = [];
    let flipkart = {};
    let x = {};
    url_flipkart = `https://www.flipkart.com/search?q=${search}`;
    y = await getdetails_flipkart(url_flipkart);
    for (let i = 0; i < y.word.length; i++) {
      let product = {};
      let finalproduct = {};
      let list_sentences = [];
      const amazon = await amazonScraper.products({
        keyword: y.word[i],
        number: 1,
        save: true,
        host: "www.amazon.in",
      });
      product["title"] = y.word[i];
      product["url"] = y.links[i];
      product["price"] = y.prices[i];
      finalproduct["flipkart"] = product;
      if (amazon.result.length > 0) {
        list_sentences = [y.word[i], amazon.result[0].title];
        try {
          sim_score = await score.sim_score(list_sentences);
        } catch (error) {
          console.log(error);
        }
        if (sim_score[0]) {
          finalproduct["amazon"] = amazon.result;
          products.push(finalproduct);
        }
      }
    }
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json({ Error: error.message });
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
