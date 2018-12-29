var http = require('http');
var querystring = require('querystring');
var util = require('util');
var form = require('fs').readFileSync('form.html');
var maxData = 2 * 1024 * 1024; // 2MB

http.createServer(function(req, res) {
  // req.methodで、クライアントから送信されたリクエストがGETであるか確認
  if(req.method === 'GET'){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(form);
  }
  // req.methodで、クライアントから送信されたリクエストがPOSTであるか確認
  if(req.method === 'POST'){
    var postData = '';
    req.on('data', function(chunk){
      // POSTデータを受信するたびに、postData変数に送る。
      postData += chunk;
      // POSTされたデータの容量が2MBを超えた場合は、413エラーを返す。
      if(postData.length > maxData){
        // postDataの内容を破棄
        postData = '';
        // this.pause()でストリームの受信を中断。しばらく後に、V8のガベージコレクションでメモリから削除される。
        // なお、stream.pauseの代わりにstream.destroyを使うと、クライアントにレスポンスを返せなくなる。
        this.pause();
        res.writeHead(413); // 413 Request Entity Too Large
        res.end('POSTデータが大きすぎます。');
      }
    }).on('end', function(){
      if(!postData){ res.end(); return; } // postDataが空の場合の処理
      // querystringモジュールのparseメソッドは、クエリストリング形式のデータをオブジェクトに変換する。
      var postDataObject = querystring.parse(postData);
      console.log('ユーザーが次のデータをPOSTしました:\n' + postData);
      // inspectメソッドは、postDataObjectを簡単に文字列にすることができる。
      res.end('あなたがPOSTしたデータ:\n' + util.inspect(postDataObject));
    });
  }
}).listen(8080);