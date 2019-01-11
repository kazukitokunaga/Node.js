var csv = require('ya-csv');
var http = require('http');

// 8080ポートにアクセスすると、データが①行ずつ出力される
http.createServer(function(req, res) {
  res.write('[');
  csv.createCsvFileReader('data.csv')
    .on('data', function(data) {
      res.write(((this.parsingStatus.rows > 0) ? ',' : '' ) + JSON.stringify(data));
    }).on('end', function() {
      res.end(']');
    });
}).listen(8080);