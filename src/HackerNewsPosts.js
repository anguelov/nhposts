'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

function PostsFetcher (config, client) {

    this.requestConfig = config;
    this.httpClient = client;

    this.retrieveHTMLDocument = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.httpClient(self.requestConfig).then(function(response) {
                resolve((response && response.data) || '');
            }).catch(function (err) {
                reject(err);
            });
        });
    };
}

function CheerioParser() {

    this.load = function load (htmlDocument){
        this.$ = cheerio.load(htmlDocument);
    };

    this.getScore = function getScore(postId) {
        return this.$('#score_'+ postId).text();
    };

    this.getTitle = function getTitle(element) {
        return this.$(element).find('.title > a').text();
    };

    this.getURL = function getUrl(element) {
        return this.$(element).find('.title > a').attr('href');
    };

    this.getId = function getId(element) {
        return this.$(element).attr('id');
    };

    this.toJSON = function toJSON(htmlDocument) {
        var self = this;
        self.load(htmlDocument);
        var posts = [];
        this.$('.athing').each(function(index, element) {
            var id = self.getId(element);
            posts.push({
                id: id,
                title: self.getTitle(element),
                url: self.getURL(element),
                score: self.getScore(id)
            });
        });
        return posts;
    };

    return {
        toJSON: this.toJSON.bind(this)
    }
}

function PostsParser(htmlDocument, htmlParser) {
    const document = htmlDocument;
    const parser = htmlParser;

    function toJSON() {
       return parser.toJSON(document);
    }

    return {
        toJSON: toJSON
    }

}

function execute() {
    const url = 'https://news.ycombinator.com/';
    const postsFetcher = new PostsFetcher({baseURL: url}, axios);
    postsFetcher.retrieveHTMLDocument().then(function(document) {

        console.log(new PostsParser(document, (new CheerioParser())).toJSON());
    })
}

if (require.main === module) {
    execute();
}

module.exports.PostsFetcher = PostsFetcher;
module.exports.CheerioParser = CheerioParser;
