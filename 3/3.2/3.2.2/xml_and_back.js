var profiles = require('./profiles');
var parser = new (require('xml2js')).Parser({
  trim: true,           // trueの場合、テキストノード前後のホワイトスペースを削除する
  explicitArray: false  // trueに設定した場合、子ノードを強制的に配列に格納する
});

// 変換対象のオブジェクトrootObjとルートノードの名前rootNameの2つのパラメータを持ち、rootObjをXML形式に変換した文字列を戻り値として返す。
function buildXML(rootObj, rootName){
  var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  rootName = rootName || 'xml';
  xml += '<' + rootName + '>\n';

  (function traverse(obj){
    Object.keys(obj).forEach(function (key) {
      var open = '<' + key + '>';
      var close = '</' + key + '>\n';
      // 渡された引数が「非オブジェクトかどうか」を判定するフラグ
      var nonObj = (obj[key] && {}.toString.call(obj[key]) !== "[object Object]");
      // 渡された引数が「配列かどうか」を判別するフラグ
      var isArray = Array.isArray(obj[key]);
      // 渡された引数が「関数かどうか」を判別するフラグ
      var isFunc = (typeof obj[key] === "function");

      // 渡された引数が配列だった場合の処理
      if(isArray){
        obj[key].forEach(function (xmlNode){
          var childNode = {};
          childNode[key] = xmlNode;
          traverse(childNode);
        });
        return;
      }

      xml += open;

      // 渡された引数が非オブジェクトだった場合の処理
      if(nonObj){
        xml += (isFunc) ? obj[key]() : obj[key];
        xml += close;
        return;
      }

      xml += '\n';
      traverse(obj[key]);
      xml += close;
    });
  }(rootObj));

  xml += '</' + rootName + '>\n';
  return xml;
}

profiles = buildXML(profiles, 'profiles').replace(/name/g, 'fullname');
console.log(profiles); // XMLをコンソールに出力する

parser.parseString(profiles, function (err, obj){
  profiles = obj.profiles;
  console.log(profiles.bert);
})
