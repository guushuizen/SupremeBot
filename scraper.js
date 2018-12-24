const rp        = require('request-promise');
const cheerio   = require('cheerio');
const argv      = require('yargs').argv;
const Entities  = require('html-entities').AllHtmlEntities;

const decoder   = new Entities();

module.exports = (url) => {
    // console.log(url);
    const options = {
        uri: url,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return new Promise((resolve, reject) => {
        rp(options)
            .then(function ($) {
                const name   = decoder.decode($('h1[itemprop=name]').html());
                const model  = decoder.decode($('p[itemprop=model]').html());

                let   sizes  = null;
                let   status = null;

                if ($("select#size").length > 0) {
                    sizes = [];

                    $("select#size option").each((index, el) => {
                        sizes.push($(el).html());
                    });
                }

                if ($('#add-remove-buttons .button.sold-out').length > 0) {
                    status = false;
                } else {
                    status = true;
                }

                const toReturn = {
                    url:    url,
                    name:   name,
                    model:  model,
                    sizes:  sizes,
                }

                resolve(toReturn);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}
