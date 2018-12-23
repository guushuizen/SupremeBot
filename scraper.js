const rp      = require('request-promise');
const cheerio = require('cheerio');
const argv    = require('yargs').argv;

var options = {
    uri: argv.url,
    transform: function (body) {
        return cheerio.load(body);
    }
};

rp(options)
    .then(function ($) {
        const name = $('h1[itemprop=name]').html();
        console.log('Name: ' + name);
        if ($('#add-remove-buttons .button.sold-out').length > 0) {
            console.log('Product is sold out.');
        } else {
            console.log('Product is in stock!');
        }
    })
    .catch(function (err) {
        console.log('Error occurred', err);
    });
