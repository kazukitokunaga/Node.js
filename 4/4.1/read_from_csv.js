var csv = require('ya-csv');
var reader = csv.createCsvFileReader('data.csv');
var data = [];

reader.on('data', function(rec){
  data.push(rec);
}).on('end', function(){
  console.log(data);
});