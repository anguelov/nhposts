const HackerNewsPosts = require('../src/HackerNewsPosts');
const PostsFetcher = HackerNewsPosts.PostsFetcher;
const CheerioParser = HackerNewsPosts.CheerioParser;

const createClient = function (responseData, resolves) {
    const isRequestResolved = resolves || true;
    return function (requestConfiguration) {
      return new Promise(function (resolve, reject) {
          if(isRequestResolved) {
              resolve({data: responseData});
          } else {
              reject({response: {data: responseData}});
          }
      });
    };

};

const document = `<table border="0" cellpadding="0" cellspacing="0" class="itemlist">
    <tr class='athing' id='17183603'>
    <td align="right" valign="top" class="title"><span class="rank">31.</span></td>      <td valign="top" class="votelinks"><center><a id='up_17183603' href='vote?id=17183603&amp;how=up&amp;goto=news%3Fp%3D2'><div class='votearrow' title='upvote'></div></a></center></td><td class="title"><a href="http://money.cnn.com/2018/05/29/news/companies/de-beers-man-made-diamonds/index.html" class="storylink">De Beers admits defeat over man-made diamonds</a><span class="sitebit comhead"> (<a href="from?site=cnn.com"><span class="sitestr">cnn.com</span></a>)</span></td></tr><tr><td colspan="2"></td><td class="subtext">
    <span class="score" id="score_17183603">713 points</span> by <a href="user?id=bkohlmann" class="hnuser">bkohlmann</a> <span class="age"><a href="item?id=17183603">1 day ago</a></span> <span id="unv_17183603"></span> | <a href="hide?id=17183603&amp;goto=news%3Fp%3D2">hide</a> | <a href="item?id=17183603">426&nbsp;comments</a>              </td></tr>
<tr class="spacer" style="height:5px"></tr>
    <tr class='athing' id='17187384'>
    <td align="right" valign="top" class="title"><span class="rank">32.</span></td>      <td valign="top" class="votelinks"><center><a id='up_17187384' href='vote?id=17187384&amp;how=up&amp;goto=news%3Fp%3D2'><div class='votearrow' title='upvote'></div></a></center></td><td class="title"><a href="https://github.com/nebulet/nebulet" class="storylink">Nebulet: A microkernel that runs WebAssembly in Ring 0</a><span class="sitebit comhead"> (<a href="from?site=github.com"><span class="sitestr">github.com</span></a>)</span></td></tr><tr><td colspan="2"></td><td class="subtext">
    <span class="score" id="score_17187384">234 points</span> by <a href="user?id=lachlan-sneff" class="hnuser">lachlan-sneff</a> <span class="age"><a href="item?id=17187384">22 hours ago</a></span> <span id="unv_17187384"></span> | <a href="hide?id=17187384&amp;goto=news%3Fp%3D2">hide</a> | <a href="item?id=17187384">119&nbsp;comments</a>              </td></tr>
<tr class="spacer" style="height:5px"></tr></table>`

describe('Suite: Posts Fetcher', function () {

    it('On fetching posts html document, HTTP request must have a valid base URL', function () {
        const client = jest.fn();
        const config = {baseURL : 'https://news.ycombinator.com'};
        const postsFetcher = new PostsFetcher(config, client);
        postsFetcher.retrieveHTMLDocument();
        const requestArgument = client.mock.calls[0][0];
        expect(requestArgument).toHaveProperty('baseURL', 'https://news.ycombinator.com');
    });

    it('When calling retrieveHTMLDocument, should return HTML string', function (done) {
        const client = createClient(document);
        const config = {baseURL : 'https://news.ycombinator.com'};
        const postsFetcher = new PostsFetcher(config, client);
        postsFetcher.retrieveHTMLDocument().then(function(html) {
            expect(html).toEqual(document);
            done();
        })
    });
});

describe('SUITE: Cheerio parser', function() {
    it('On calling to json on html parser, should return array', function () {
        const cheerioParser = new CheerioParser();
        const result = cheerioParser.toJSON(document);
        expect(result).toBeInstanceOf(Array);
    });
    it('On calling to json on html parser, should return array of 2 posts', function () {
        const cheerioParser = new CheerioParser();
        const result = cheerioParser.toJSON(document);
        expect(result).toHaveLength(2);
    });
    it('On calling to json on html parser, should return array of Objects with "id" property', function () {
        const cheerioParser = new CheerioParser();
        const result = cheerioParser.toJSON(document);
        result.forEach(function(post){
            expect(post).toHaveProperty('id')
        })
    });
    it('On calling to json on html parser, should return array of Objects with "title" property', function () {
        const cheerioParser = new CheerioParser();
        const result = cheerioParser.toJSON(document);
        result.forEach(function(post){
            expect(post).toHaveProperty('title')
        })
    });
    it('On calling to json on html parser, should return array of Objects with "score" property', function () {
        const cheerioParser = new CheerioParser();
        const result = cheerioParser.toJSON(document);
        result.forEach(function(post){
            expect(post).toHaveProperty('score')
        })
    });
    it('On calling to json on html parser, should return array of Objects with "url" property', function () {
        const cheerioParser = new CheerioParser();
        const result = cheerioParser.toJSON(document);
        result.forEach(function(post){
            expect(post).toHaveProperty('url')
        })
    });
});