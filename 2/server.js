var http = require('http');
var querystring = require('querystring');
var util = require('util');
var form = require('fs').readFileSync('form.html');

http.createServer(function(req, res) {
  if(req.method === 'GET'){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(form);
  }
  if(req.method === 'POST'){
    var postData = '';
    req.on('data', function(chunk){
      postData += chunk;
    }).on('end', function(){
      // querystringモジュールのparseメソッドは、クエリストリング形式のデータをオブジェクトに変換する。
      var postDataObject = querystring.parse(postData);
      console.log('ユーザーが次のデータをPOSTしました:\n' + postData);
      // inspectメソッドは、postDataObjectを簡単に文字列にすることができる。
      res.end('あなたがPOSTしたデータ:\n' + util.inspect(postDataObject));
    });
  }
}).listen(8080);