var http = require('http');
var formidable = require('formidable');
var form = require('fs').readFileSync('form.html');

http.createServer(function(req, res){
  if(req.method === 'GET'){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(form);
  }
  if(req.method === 'POST'){
    // POSTデータを受け取るとインスタンスを生成
    var incoming = new formidable.IncomingForm();
    // ファイルをアップロードするディレクトリを指定
    incoming.uploadDir = 'uploads';
    // incomingがそれぞれのファイル読み込み終了時に発生させるfileイベントを待機。fileイベントはコールバックにfieldとfile（アップロードファイルの情報を格納したオブジェクト）という2つの引数を渡す。
    incoming.on('file', function(field, file) {
      if (!file.size){return;}
      res.write(file.name + 'を受け取りました\n');
    }).on('end', function(){
      // multipartメッセージの解析終了時に発行されるendイベントを受け取ると、res.endでレスポンスの構築を終了して送信する
      res.end('すべてのファイルを受け取りました。');
    });
    incoming.parse(req);
  }
}).listen(8080);