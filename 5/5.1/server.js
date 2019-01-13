var http = require('http');
// websocketモジュールを呼び出し、コンストラクタ関数を格納。
var WSServer = require('websocket').server;
var url = require('url');
var clientHtml = require('fs').readFileSync('client.html');

var plainHttpServer = http.createServer(function(req, res){
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(clientHtml);
}).listen(8080);

// インスタンスを生成して、設定オブジェクトの一部としてplainHttpServerをパラメータに渡す。これにより、plainHttpServerがWebsocketサーバーに紐づけされる。
var webSocketServer = new WSServer({ httpServer: plainHttpServer });
// webSocketサーバーへの接続を許可するホストのリスト。（＝ホワイトリスト）セキュリティを高める。
var accept = ['localhost', '127.0.0.1'];

// requestイベントハンドラ
webSocketServer.on('request', function(req){
  req.origin = req.origin || '*'; // req.originが存在しない場合は、*をワイルドカードとして使用
  // リクエストの送信元（req.origin）がaccept配列にあるか確認。req.originをurl.parseで分解し、ホスト名を取得。
  if(accept.indexOf(url.parse(req.origin).hostname) === 1){
    // 存在しない場合は、req.rejectを呼び出し、要求を拒否する。
    req.reject();
    console.log(req.origin + 'からのアクセスは許可されていません');
    return;
  }

  // ホワイトリスト（accept配列）を通過し、Websocketサーバーへの接続を受け付ける場合は、req.acceptの戻り値（WebSocketConnectionのインスタンス）を変数に格納。
  // req.acceptの1つ目のパラメータは、今回はnullを指定しているが、カスタムサブプロトコルを定義することができ、サブプロトコルごとに違う動作を設定できる。
  // req.acceptの2つ目のパラメータは接続を受け入れるホスト名を渡す。
  // 3つ目のパラメータにクッキーを渡すこともできる。
  var websocket = req.accept(null, req.origin);

  // クライアントからのメッセージを受け取るたびに、websocketはmessageイベントを発生させる。
  websocket.on('message', function(msg){
    // 受信したメッセージをコンソールに出力
    console.log('"' + msg.utf8Data + '"を' + req.origin + 'から受信');
    if(msg.utf8Data === 'Hello'){
      // ブラウザにメッセージを返す。
      websocket.send('WebSocketサーバーからこんにちは！');
    }
  });

  // 接続が切断された時のイベントハンドラ
  websocket.on('close', function(code, desc){
    // コンソールに出力
    console.log('接続解除：' + code + ' - ' + desc);
  });
})