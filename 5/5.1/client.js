var WSClient = require('websocket').client;

// Websocketモジュールのclientメソッドを使って新しいクライアントのインスタンスを生成し、connectとconnectFaildイベントを待機
new WSClient()
  .on('connect', function(connection){
    var msg = 'Hello';
    connection.send(msg);
    console.log('送信：' + msg);
    connection.on('message', function(msg){
      console.log('受信：' + msg.utf8Data);
    }).on('close', function(code, desc){
      console.log('切断：' + code + ' - ' + desc);
    }).on('error', function(error){
      console.log('エラー：' + error.toString());
    });
  }).on('connectFaild', function(error){
    console.log('コネクションエラー：' + error.toString());
  // connectメソッドをチェーンでつなぎ、最初のパラメータにはWebsocketサーバーアドレスを渡し、２つ目にはサブプロトコルを渡す。３つ目には、req.originに格納される値を格納。
  }).connect('ws://localhost:8080/', null, 'http://localhost:8080');