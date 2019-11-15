var fs=require('fs');
var Converter=require('csvtojson').core.Converter;

function convertCsvToJson(name, action, callback) {
  var csvFileName = './' + name + '.txt';
  var fileStream = fs.createReadStream(csvFileName);

  var param={ delimiter: '\t' };
  var csvConverter=new Converter(param);

  csvConverter.on('end_parsed', function (jsonObj) {
    fs[action + 'File']('./js/people.js', 'var listOf' + name[0].toUpperCase() + name.slice(1) + ' = ' + JSON.stringify(jsonObj) + ';', function() {
      if (callback) callback();
    });
  });

  fileStream.pipe(csvConverter);
}

convertCsvToJson('people', 'write', convertCsvToJson.bind(undefined, 'alumni', 'append'));