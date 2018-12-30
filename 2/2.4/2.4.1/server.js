var http = require('http');
var fs = require('fs');

var options = {}
options.file = '50meg';
options.fileSize = fs.statSync(options.file).size;
options.kbps = 32; // キロバイト毎秒

http.createServer(function(req, res){
  // オブジェクトを宣言
  var download = Object.create(options);
  // 宣言したオブジェクトに2つのプロパティを追加。
  // 1つはreadStreamのdataイベントで発生するファイルデータの一時的な格納場所としてのプロパティ
  download.readStreamOptions = {};
  download.chunks = new Buffer(download.fileSize);
  // もう1つは、ディスクから読み込まれたデータのバイト数を格納するプロパティ
  download.bufferOffset = 0;
  download.statusCode = 200;
  download.headers = {'Content-Length':download.fileSize};
  if(req.headers.range){
    download.start = req.headers.range.replace('bytes=', '').split('-')[0];
    download.readStreamOptions = {start: +download.start};
    download.headers['Content-Range'] = 'bytes ' + download.start +
      '-' + download.fileSize + '/' + download.fileSize;
    download.statusCode = 206; // Partial Content
    download.headers['Content-Length'] = download.fileSize - download.start;
  }
  res.writeHeader(download.statusCode, download.headers);
  fs.createReadStream(download.file, download.readStreamOptions)
    // readStreamのdataイベント発生時
    .on('data', function(chunk){
      chunk.copy(download.chunks, download.bufferOffset);
      download.bufferOffset += chunk.length;
    }).once('open', function() {
      var handleAbort = throttle(download, function (send){
        // sendにはthrottle関数のコールバックが渡されて、クライアントに送信される。
        res.write(send);
      });
      req.on('close', function (){
        handleAbort();
      });
    });
}).listen(8080);

// クライアントからの各リクエストで生成されるdownloadオブジェクトにアクセス
function throttle(download, cb){
  // download.kbpsで設定されたダウンロード速度を変数に代入
  var chunkOutSize = download.kbps * 1024;
  // setTimeoutに渡すインターバル時間を格納したtimer変数を宣言
  var timer = 0;

  (function loop(bytesSent) {
    if(!download.aborted){
      setTimeout(function() {
        var bytesOut = bytesSent + chunkOutSize;
        // 送り出すのに十分なデータがたまっているか判定。
        if (download.bufferOffset > bytesOut){
          // 十分なデータ量がたまっていれば、timerに1000を設定し、1秒に1回データを送信するというポリシーを実行する。
          timer = 1000;
          // download.chunkに格納されたBufferからデータを切り出す。
          // Bugger.sliceは、startとendの2つの引数を取り、それぞれbytesSentとbytesOutを代入する。
          cb(download.chunks.slice(bytesSent, bytesOut));
          loop(bytesOut);
          return;
        }
        // bytesOutがdownloas.headers['Content-Length']のバッファサイズ（つまり、送信するファイルサイズ）と同じか大きい場合
        if (bytesOut >= download.headers['Content-Length']){
          if(download.bufferOffset == download.headers['Content-Length']){
            // sliceで残りのすべてのバッファを切り出して送信する。
            cb(download.chunks.slice(bytesSent));
            return; // 再帰終了
          }
        }
        // bytesOutがdownloas.chunksのバッファサイズ（つまり、送信するファイルサイズ）と同じか大きい場合
        if (bytesOut >= download.chunks.length){
          // sliceで残りのすべてのバッファを切り出して送信する。
          cb(download.chunks.slice(bytesSent));
         return; // 再帰終了
       }
        loop(bytesSent);
      }, timer);
    }
  }(0));
  return function (){
    download.aborted = true;
  }
}