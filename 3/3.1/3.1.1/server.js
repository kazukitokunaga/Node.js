var http = require('http');
var url = require('url');
var profiles = require('./profiles');
http.createServer(function(req, res){
  // リクエストURLのクエリストリングを変数に格納
  var urlObj = url.parse(req.url, true);
  // callbackパラメーターを変数に格納
  var cb = urlObj.query.callback;
  // whoパラメーターを変数に格納
  var who = urlObj.query.who;
  var profile;
  if(cb && who){
    profile = cb + "(" + JSON.stringify(profiles[who]) + ")";
    // レスポンスを返す
    res.end(profile);
  }
}).listen(8080);