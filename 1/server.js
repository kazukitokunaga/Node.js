var http = require('http');
// pages配列を定義
var pages = [
  {route: '/', output: 'シンプルなサンプルコードです。'},
  {route: '/about/this', output: 'Nodeで複数階層ルーティング'},
  {route: '/about/node', output: 'V8エンジンのためのイベントI/O'},
  {route: '/another page', output: function(){return 'これが' + this.route;}}
];
http.createServer(function (request, response) {
  // pathのbasenameではなく、request.urlを渡す
  var lookup = decodeURI(request.url);
  // pages配列のrouteプロパティの値がlookup変数の値にマッチするかどうかを判定。
  pages.forEach(function(page){
    if (page.route === lookup){
      // マッチした場合はそのオブジェクトのoutputプロパティの値を返す
      response.writeHead(200, {'Content-type': 'text/html'});
      response.end(typeof page.output === 'function' ? page.output() : page.output);
    }
  });
  // マッチしない場合は404を返す
  if (!response.finished){
    response.writeHead(404);
    response.end('ページが見つかりません！')
  }
}).listen(8080);