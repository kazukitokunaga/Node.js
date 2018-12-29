var http = require('http');
var url = require('url');
var urlOpts = {host: 'www.nodejs.org', path: '/', port: '80'};

// process.argvで、取得先のURLがコマンドラインに入力されたかどうかを確認する。process.argvはNodeのグローバルオブジェクトで、requireで読み込む必要が無く、どこからでも呼び出せる。
if(process.argv[2]){ // process.argv[2]は、コマンドラインの3つ目の引数。
  // process.argvが存在する場合（つまり、コマンドラインで「node fetch.js www.google.com」のようにアドレスが指定されている場合）、
  if (!process.argv[2].match('http://')){
    // http://が付与されてない場合は、付与する。
    process.argv[2] = 'http://' + process.argv[2];
  }
  // urlOpts変数に格納する。
  urlOpts = url.parse(process.argv[2]);
}

// http.getはリクエスト先の情報を定義したオブジェクトを引数に取る。ここでは、www.nodejs.orgにアクセスするよう、デフォルト値をurlOpts変数に設定している。
// サーバーからのレスポンスを受け取ると、そのレスポンスに対してHTTPクライアントとして処理を行う。
http.get(urlOpts, function(res){
  // http.getのコールバック関数で、resオブジェクトのdataイベントを待機する。
  res.on('data', function(chunk){
    // resのデータストリームを受信すると、そのchunkをコンソールに出力する。
    console.log(chunk.toString());
  });
});