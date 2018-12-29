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
// cacheAndDeliver関数を削除して、コールバック関数内で処理を行う。
http.createServer(function (request, response) {
  // サーバーで探すファイル名を格納するlookup変数を宣言
  var lookup = path.basename(decodeURI(request.url)) || 'index.html',
  // 上記で格納したbasenameにcontent/を付与する。
  f = 'content/' + lookup;
  // ファイルが存在するか判定
  fs.exists(f, function(exists){
    if(exists){
      var headers = {'Content-Type' : mimeTypes[path.extname(f)]};
      if (cache[f]){
        response.writeHead(200, headers);
        response.end(data);
        return;
      }
      // fs.createReadStreamは、readStreamオブジェクトを返す。readStreamオブジェクトは、fパラメータに渡されるパスで指定されたファイルのストリームオブジェクト。
      // readStreamオブジェクトはEventEmitterクラスを継承しており、さまざまな場面でイベントを発行する。イベントハンドラを設定するには、addEventListenerを使うか、短縮形のonを使う。
      // なお、ストリームは一度しかopenイベントを発行しないので、onの代わりにonceを使う。これにより、一度イベントが発生してコールバックを実行するとイベントリスナを破棄する。
      var s = fs.createReadStream(f).once('open', function(){
        // readStreamの開始時に一度だけ実行
        response.writeHead(200, headers);
        // pipeメソッドでストリームデータを受け取り、クライアントに送る。stream.pipeはストリームが終了すると自動的にresponse.endを呼び出す。
        this.pipe(response);
      }).once('error', function(e) {  // errorイベント発生時のハンドラ
        console.log(e);
        response.writeHead(500);
        response.end('サーバーエラー！');
      });
      // 上記でレスポンスデータをクライアントに送り続ける一方で、以下でそのコンテンツをメモリにキャッシュする
      fs.stat(f, function(err, stats){
        var bufferOffset = 0;
        // cache[f].contentの値として、Bufferオブジェクトを宣言。引数には、fs.statのファイル長のデータを渡す。
        // Bufferクラスのインスタンスは、生成時にバッファサイズ（バイト数）、配列もしくは文字列を指定しなければならないが、この場合はバッファサイズを指定する。
        // バッファサイズは、非同期でファイルの情報を取得するfs.statメソッドのコールバックに渡されたstatsのsizeプロパティを取得して使用する。
        cache[f] = {content: new Buffer(stats.size)};
        // readStreamのdataイベントは、コールバック関数にBufferインスタンスを返す。
        s.on('data', function(data){
          // ストリームのデフォルトのbufferSizeは64KBで、これより小さいファイルは1回のchunk（データの小さい塊）でデータ全体を転送できるため、dataイベントは1回だけ発生する。
          // このサイズより大きいファイルをキャッシュする場合は、chunkが1つずつ送られてくるたびにcache[f].contentプロパティに足していく。
          // chunkはバイナリデータだが、+演算子で連結してしまうと文字列に変換されてしまう。そこで、cache[f].bufferのBufferインスタンスにcopyでコピーしている。
          data.copy(cache[f].content, bufferOffset);
          // chunkを足すたびに、bufferOffsetにchunkの長さを足して、chunkからBuffer.copyを呼ぶ際にコピー領域の先頭を表すbufferOffsetを2番めのパラメータに渡す。
          bufferOffset += data.length;
        });
      });
    }
  });
}).listen(8080);