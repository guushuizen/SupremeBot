const rp          = require('request-promise');
const cheerio     = require('cheerio');
const argv        = require('yargs').argv;
const { exec }    = require('child_process')
const getInfo     = require('./scraper.js');

const masterURL = 'https://supremenewyork.com/shop/all';
const delay     = argv.delay;

const products  = {};

const checkAll = () => {
    const options = {
        uri: masterURL,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    rp(options)
    .then(($) => {
            $("#container").children().each((index, element) => {
                const url = $(element).find('a').attr('href');
                const result = getInfo('https://supremenewyork.com' + url).then((obj) => {
                    products[url] = obj;
                });
            });
        }
    );
}

setInterval(() => {
    console.log(products);
    checkAll();
}, 10000)
