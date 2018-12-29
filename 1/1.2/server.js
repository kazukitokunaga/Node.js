var http = require('http');
var path = require('path');
var fs = require('fs');
// createServerのコールバック関数の外に宣言すると、リクエストされたファイルが存在する場合はpath.extnameで取得したファイルの拡張子をmimeTypesのオブジェクトで検索し、得られたContent-Typeの値をresponse.writeHeadに渡す。
var mimeTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css'
};
http.createServer(function (request, response) {
  // サーバーで探すファイル名を格納するlookup変数を宣言
  var lookup = path.basename(decodeURI(request.url)) || 'index.html',
  // 上記で格納したbasenameにcontent/を付与する。
  f = 'content/' + lookup;
  // ファイルが存在するか判定
  fs.exists(f, function(exists){
    if(exists){
      // ファイルが存在する場合は、fs.readFileを非同期で読み込む。
      fs.readFile(f, function(err, data){
        if(err){  // エラーハンドリング
          response.writeHead(500);
          response.end('Server Error!');
          return;
        }
        var headers = {'Content-Type' : mimeTypes[path.extname(f)]};
        response.writeHead(200, headers);
        response.end(data);
      });
      // fs.readFileメソッドの外にreturnを置くことで、fs.existsがtrueを返した後に404レスポンスの生成等を行わないようにしている。
      return;
    }
    response.writeHead(404);
    response.end('ページが見つかりません。');
  });
}).listen(8080);