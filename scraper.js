const rp        = require('request-promise');
const cheerio   = require('cheerio');
const argv      = require('yargs').argv;
const Entities  = require('html-entities').AllHtmlEntities;

const decoder   = new Entities();

var options = {
    uri: argv.url,
    transform: function (body) {
        return cheerio.load(body);
    }
};

rp(options)
    .then(function ($) {
        const name  = decoder.decode($('h1[itemprop=name]').html());
        const model = decoder.decode($('p[itemprop=model]').html());

        console.log('Name: ' + name + ' - ' + model);
        if ($('#add-remove-buttons .button.sold-out').length > 0) {
            console.log('Product is sold out.');
        } else {
            console.log('Product is in stock!');
        }
    })
    .catch(function (err) {
        console.log('Error occurred', err);
    });
