var http = require('http');
var url = require('url');
// pages配列を定義
var pages = [
  // http://localhost:8080/?id=1のようにURLにクエリストリングを追加することによって、該当するidプロパティを持ったコンテンツにアクセスすることができる。
  {id: '1', route: '', output: 'WooHoo!'},
  {id: '2', route: 'about', output: 'シンプルなサンプルコードです。'},
  {id: '3', route: 'another page', output: function () {return 'これが' + this.route;}},
];
http.createServer(function (request, response) {
  var id = url.parse(decodeURI(request.url), true).query.id;
  if (id){
    pages.forEach(function(page){
      if(page.id === id){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(typeof page.output === 'function' ? page.output() : page.output);
      }
    });
  }
  if (!response.finished){
    response.writeHead(404);
    response.end('ページが見つかりません！');
  }
}).listen(8080);