var http = require('http');
var fs = require('fs');
var path = require('path');
var profiles = require('./profiles');
var buildXml = require('./buildXml');
var index = fs.readFileSync('index.html');

var mimes = { xml: "application/xml", json: "application/json" };

// formatパラメータにextname（拡張子）を渡すことで、contentパラメータに渡されたオブジェクトをJSONまたはXMLで返す。
function output(content, format, rootNode) {
  // 拡張子が指定されていない、または、jsonを指定された場合は、jsonを返す。
  if (!format || format === 'json') {
    return JSON.stringify(content);
  }
  if (format === 'xml') {
    return buildXml(content, rootNode);
  }
}

// path.dirnameが返す文字列に合わせてルーティングを設定
var routes = {
  // profilesは画面が開いた時に呼ばれる「http://localhost:8080/profiles」のこと。
  'profiles': function (format) {
    return output(Object.keys(profiles), format);
  },
  // /profileは取得するボタンを押した時に呼ばれる「http://localhost:8080/profile/(名前).(format)」のこと
  '/profile': function (format, basename) {
    // outputメソッドの引数に拡張子とファイル名を渡す。
    return output(profiles[basename], format, basename);
  }
};

http.createServer(function (req, res) {
  var dirname = path.dirname(req.url); // ディレクトリ名
  var extname = path.extname(req.url); // 拡張子
  var basename = path.basename(req.url, extname); // ファイル名
  extname = extname.replace('.',''); // ピリオドを削除する
  res.setHeader("Content-Type", mimes[extname] || 'text/html');
  // リクエストされたURLのdirname文字列がroutesのプロパティに存在するか確認する。
  if (routes.hasOwnProperty(dirname)){ // dirnameがある場合
    res.end(routes[dirname](extname, basename)); // 拡張子とファイル名を返す
    return;
  }
  if (routes.hasOwnProperty(basename)) { // dirnameは無いが、basenameがある場合
    res.end(routes[basename](extname)); // 拡張子を返す
    return;
  }
  // dirnameもextnameもない場合はindexを返す。
  res.end(index);
}).listen(8080)