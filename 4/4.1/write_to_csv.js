var csv = require('ya-csv');
// createCsvFileWriterメソッドはya-csvのCsvWriterのインスタンスを生成
var writer = csv.createCsvFileWriter('custom_data.csv',{
  // データ区切り文字を指定
  'separator': ':',
  // データを囲む引用文字を指定
  'quote': '|',
  // escapeプロパティは、quoteプロパティの値に指定された文字がデータフィールド内にある場合に、データフィールドを誤って閉じないようにエスケープを行う文字。
  'escape': '\\' // バックスラッシュはエスケープされるので、実際の値はバックスラッシュ1文字
});

var data = [['a','b','c','d','e|','f','g'],['h','i','j','k','l','m','n']];

data.forEach(function(rec){
  // writeRecordメソッドはそれぞれの配列をデータ行に再構築して、fs.WriteStreamのインスタンスに渡している。
  writer.writeRecord(rec);
});

