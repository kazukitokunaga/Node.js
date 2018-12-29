var http = require('http');
var path = require('path');
var fs = require('fs');
// createServerのコールバック関数の外に宣言すると、リクエストされたファイルが存在する場合はpath.extnameで取得したファイルの拡張子をmimeTypesのオブジェクトで検索し、得られたContent-Typeの値をresponse.writeHeadに渡す。
var mimeTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css'
};
// コンテンツをメモリ領域に記憶するためのオブジェクト
var cache = {};
// cacheAndDeliver関数を宣言。
function cacheAndDeliver(f, cb) {
  // fs.statメソッドは、コールバックの第2引数としてさまざまなファイル情報を持ったオブジェクトを返す。
  fs.stat(f, function(err, stats){
    // ctimeは、パーミッションの変更なども含めたファイルの変更日時のプロパティ。
    var lastChanged = Date.parse(stats.ctime);
    // キャッシュが存在し、かつ、最後にファイルが修正された日時がキャッシュの日時よりあとの場合は、isUpdatedにtrueを格納
    var isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;
    // cacheが無い場合、または、キャッシュが古い場合（isUpdatedがtrueの場合）はキャッシュに保存
    if(!cache[f] || isUpdated){
      fs.readFile(f, function (err, data) {
        console.log(f + 'をファイルから読み込みます。');
        if(!err){
          cache[f] = {
            content : data,
            // リクエストされたファイルが最後にキャッシュされた日時をキャッシュする
            timestamp : Date.now() // Unixタイムスタンプを記録する
          };
        };
        cb (err,data);
      });
      return;
    }
    // キャッシュがある場合は、キャッシュをコールバックで返す。
    console.log(f + 'をキャッシュから読み込みます。');
    cb(null, cache[f].content);
  });
}
http.createServer(function (request, response) {
  // サーバーで探すファイル名を格納するlookup変数を宣言
  var lookup = path.basename(decodeURI(request.url)) || 'index.html',
  // 上記で格納したbasenameにcontent/を付与する。
  f = 'content/' + lookup;
  // ファイルが存在するか判定
  fs.exists(f, function(exists){
    if(exists){
      // ファイルが存在する場合は、cacheAndDeliver関数を非同期で読み込む。
      cacheAndDeliver(f, function(err, data){
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