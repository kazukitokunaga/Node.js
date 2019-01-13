var http = require('http');
var clientHtml = require('fs').readFileSync('client.html');

var plainHttpServer = http.createServer(function(req, res){
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(clientHtml);
}).listen(8080);

// websocketモジュールではHTTPサーバーをオブジェクトに格納してWebsocketサーバーに渡したが、socket.ioではlistenメソッドに渡す。
var io = require('socket.io').listen(plainHttpServer);
io.set('origins', ['localhost:8080', '127.0.0.1:8080']);
// io.socketのconnectionメソッドを待機
io.sockets.on('connection', function(socket){
  socket.on('message', function(msg) {
    // 受け取ったメッセージがHelloであれば、socket.io!という文字列をレスポンスで返す
    if(msg === 'Hello'){
      socket.send('socket.io!');
    }
  });
});