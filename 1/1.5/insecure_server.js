var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
// ホワイトリストを使ってアクセスを厳格に管理する
var whitelist = [
  '/index.html',
  '/subcontent/styles.css',
  '/subcontent/script.js'
];

http.createServer(function(request, response){
  // リクエストされたパスに対するルールがホワイトリストに記載されていない場合は、たとえ実ファイルが存在したとしても404を返す。
  if (whitelist.indexOf(lookup) === -1){
    response.writeHead(404);
    response.end('ページが見つかりません。');
    return;
  }
  var lookup = url.parse(decodeURI(request.url)).pathname;
  lookup = (lookup === "/") ? '/indedx.html' : lookup;
  var f = 'content/' + lookup;
  console.log(f);
  fs.readFile(f, function(err, data){
    response.end(data);
  });
}).listen(8080);

