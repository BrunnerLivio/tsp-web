'use strict';

module.exports = function parse(output, options) {
  options = options || {};
  var separator = options.separator || ' ';
  var lines = output.split('\n');

  if (options.skipLines > 0) {
    lines.splice(0, options.skipLines);
  }

  var headers = lines.shift();
  var splitHeader = headers.split(separator);

  var limits = [];

  for (var i = 0; i < splitHeader.length; i++) {
      var colName = splitHeader[i].trim();

      if(colName !== '') {
          limits.push({label: colName, start: headers.indexOf(colName)});
      }
  }

  var table = lines.map(function(line) {
      if(line){
          var result = {};

          for (var key in limits) {
              var header = limits[key];
              var nextKey = parseInt(key, 10)+1;
              var start = (key === '0') ? 0 : header.start;
              var end = (limits[nextKey]) ? limits[nextKey].start - start : undefined;

              result[header.label] = line.substr(start, end).trim();
          }

          return result;
      }
  });

  (table[table.length-1] === undefined) && table.pop();

  return table;
};
