var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

http.createServer(function(request, response){
  // path.basenameではなく、url.parseでurlを取得
  var lookup = url.parse(decodeURI(request.url)).pathname;
  // url.parseでurlを取得する場合は、path.normalizeでクリーンにしておくことで、悪意ある第三者からの攻撃（相対ディレクトリトラバーサルやヌルバイト攻撃）から守ることができる。
  lookup = path.normalize(lookup);
  lookup = (lookup === "/") ? '/indedx.html-serve' : lookup + '-serve';
  var f = 'content-pseudosafe' + lookup;
  console.log(f);
  fs.readFile(f, function(err, data){
    response.end(data);
  });
  fs.exists(f, function(exists){
    if(!exists){
      response.writeHead(404);
      response.end();
      return;
    }
  });
}).listen(8080);