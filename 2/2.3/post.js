var http = require('http');
var urlOpts = {
  host: 'localhost',
  path: '/',
  port: '8080',
  method: 'POST'
}

// http.requestはclientRequestオブジェクトを返す。ここでは、そのオブジェクトをrequest変数に格納する。
var request = http.request(urlOpts, function(res){
  res.on('data', function(chunk){
    console.log(chunk.toString());
  }).on('error', function(e){
    console.log('エラー：' + e.stack);
  });
});

// POSTデータとなるプロセスの引数をforEachを使って取得する。0番目と1番目の引数はnodeとpost.jsなので、2番目以降の引数を探す。
process.argv.forEach(function(postItem, index){
  // 2番目以降の引数をrequest.writeメソッドでリクエストを構築する。
  if(index > 1){request.write(postItem);}
});

// forEachはコールバック関数を使うが非同期実行ではない。そのため、request.endは常にforEachループが終了した後に呼ばれる。
request.end();