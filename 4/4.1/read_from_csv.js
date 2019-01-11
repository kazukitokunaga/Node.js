var csv = require('ya-csv');
var reader = csv.createCsvFileReader('custom_data.csv', {
  'separator': ':',
  'quote': '|',
  'escape': '\\'
});
var data = ｀｀｀｀[];

reader.on('data', function(rec){
  data.push(rec);
}).on('end', function(){
  console.log(data);
});