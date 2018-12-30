var http = require('http');
var fs = require('fs');
var urlOpts = {
  host: 'localhost',
  path: '/',
  port: '8080',
  method: 'POST'
}
var boundary = Date.now();
urlOpts.headers = {
  'Content-Type':'multipart/form-data; boundary="' + boundary + '"'
};
boundary = "--" + boundary;
var request = http.request(urlOpts, function(res){
  res.on('data', function(chunk){
    console.log(chunk.toString());
  });
}).on('errer', function(e){
  console.log('エラー：' + e.stack);
});

// 即時関数（定義したその場で即実行する関数。「(function(...){...}(引数)）」という書き方をする。
(function multipartAssembler(files) {
  // 最初のファイル名をf変数に代入（shiftメソッドは0番目のインデックスの要素を削除してインデックスの連番の値をシフトし、削除した値を返す。）
  var f = files.shift();
  var fSize = fs.statSync(f).size;
  var progress = 0;
  fs.createReadStream(f)
    // openイベント発生時にヘッダを構築
    .once('open', function(){
      request.write(boundary + '\r\n' +
      // Content-Dispositionヘッダは、セミコロンによって3つの部分に別れている。
      'Content-Disposition: form-data; name="userfile="; filename="' + f + '"\r\n' +
      // Content-Typeヘッダは、必要なMIMEタイプを設定。
      'Content-Type: application/octet-stream\r\n' +
      // Content-Transfer-Encodingヘッダにbinaryを設定しておくと、サーバー側でファイルを保存する際にMIMEタイプや文字コードを使って何らかの処理を行わない場合、すべてのファイルを同じ方法で扱うことができる。
      'Content-Transfer-Encoding: binary\r\n\r\n'); // multipartのそれぞれのパートのヘッダはCRLF2回（\r\n\r\n）で終了するため、request.writeの最後に記述する。
    }).on('data', function(chunk){
      // chunkをサーバーに送信
      request.write(chunk);
      // chunkの合計をファイルサイズで割ったパーセンテージを求める。
      progress += chunk.length;
      console.log(f + ':' + Math.round((progress / fSize) * 10000) / 100 + '%');
    // endイベントが発生した際の処理
    }).on('end', function(){
      if(files.length){
        request.write('\r\n');
        multipartAssembler(files); // ファイルが残っていれば再帰する
        return;
      }
      // ファイルが残っていなければ、最後のmultipartの区切りを入れてリクエストを終了。
      request.end('\r\n' + boundary + '--\r\n\r\n\r\n');
     // この領域に記述されたコードは、全てのファイルストリームが処理された後に実行される
    });
// spliceを使って、process.argv配列から最初の2つの引数を除く残りの配列がmultipartAssemblerのfiles引数に渡される。
}(process.argv.splice(2, process.argv.length)));