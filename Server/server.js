const express = require('express')
const app = express()
const port = 3000
const amazonScraper = require('amazon-buddy');
const cheerio = require('cheerio');
const axios = require("axios");
const cors = require('cors');
const { request } = require('express');
const { element } = require('svelte/internal');
require('events').EventEmitter.defaultMaxListeners = 15;


app.use(cors());

app.get('/', (req, res) => res.send("hello world"))


app.get("/search", async (req,res) => {
    let search='';
    let flipurl = "https://www.flipkart.com";
    let snapurl = "https://www.snapdeal.com";
    let s = '/search?q=';
   search = req.query.query;
    try {
        // Collect 50 products from a keyword 'xbox one'
        let link;
        let final = [];
        // Amazon
        const products = await amazonScraper.products({ keyword: search, number: 10, save: true, host: 'www.amazon.in' });
        for(let i=0;i < products.result.length; i++) {
            word = products.result[i].title.replace(/ *\([^)]*\) */g, "");
            // Flipkart
            const urlResponse = await axios.get(`https://www.flipkart.com/search?q=${encodeURI(word)}`)
            const $ = cheerio.load(urlResponse.data);
            if($('a').hasClass('_31qSD5')){
                link = $('a._31qSD5').attr('href');
            }
            else {
                link = $('a._2cLu-l').attr('href');
            }
            let fprice;
            if(link){
                    const prices = [];
                    $('div._1vC4OE').each(function(i, elem) {
                    prices[i] = $(this).text();
                });
                fprice = prices[0];
            }
            else{
                fprice = false;
            }
            flink = flipurl+link;
            flipcart={
                flink,
                fprice
            }
            let x = {};
            x["amazon"] = products.result[i]
            x['flipkart'] = flipcart;
            final.push(x);
        }
        res.status(200).json(final);
    } catch (error) {
        console.log(error);
        res.status(400).json({Error:error.message})
    }
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))