var http = require('http');
var colors = require('colors');

function makeCall(urlOpts, cb) {
  http.get(urlOpts, function(res){
    // twitter APIにリクエストを送る
    trendingTopics.jsonHandler(res, cb);
  }).on('error', function (e) {
    console.log('接続エラー：' + e.message);
  });
}

var trendingTopics = module.exports = {
  trends: {
    urlOpts: {
      host: 'api.twitter.com',
      path: '/1/trends/1.json', // 1.jsonはグローバルトレンドを返す
      headers: {'User-Agent': 'Node Cookbook: Twitter トレンド'}
    }
  },
  tweets: {
    maxcResults: 3,
    resultsType: 'realtime',
    language: 'en',
    urlOpts: {
      host: 'serch.twitter.com',
      headers: {'User-Agent': 'Node Cookbook: Twitterトレンド'}
    }
  },
  jsonHandler: function (res, cb) {
    var json = '';
    res.setEncoding('utf8');
    if (res.statusCode === 200) {
      res.on('data', function (chunk) {
        json += chunk;
      }).on('end', function () {
        cb(JSON.parse(json));
      });
    }else{
      throw('サーバーがエラーを返しました。エラーコード：' + res.statusCode);
    }
  },
  tweetPath: function (q) {
    var p = '/serch.json?lang=' + this.tweets.language + '&q=' + q + '&rpp=' + '&with_twitter.maxResults' + '&include_entities=true' + '&with_twitter_user_id=true&result_type=' + this.tweets.resultsType;
    this.tweets.urlOpts.path = p;
  }
};

makeCall(trendingTopics.trends.urlOpts, function (trendsArr) {
  trendingTopics.tweetPath(trendsArr[0].trends[0].query);
  makeCall(trendingTopics.tweets.urlOpts, function (tweetsObj) {
    tweetsObj.results.forEach(function (tweetsObj) {
      tweetsObj.results.forEach(function (tweet) {
        console.log(tweet.from_user.yellow.bold + ':' + tweet.text);
      });
    });
  })
})