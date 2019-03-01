
var Excel = require('exceljs');

var workbook = new Excel.Workbook();
console.log(workbook); 
var worksheet = workbook.getWorksheet(0);

//workbook.eachSheet(function(worksheet, sheetId) {
//    console.log(sheetId.name)
//    // ...
//});
//workbook.getWorksheet(
//    ( sheet => {
//  const sheet = [];
//  worksheet.eachRow(row => {
//    sheet.push(row.values);
//  });
//book.push(sheet);
//});

//worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
//    console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
//});



// shifts['shiftID'] = row_values[0]
// shifts['shiftName'] = row_values[1]
// shifts['stationCode'] = row_values[2]
// shifts['startTime'] = to8601(row_values[4])
// shifts['endTime'] = to8601(row_values[5])
// shifts['notes'] = row_values[6]
// shifts['crewOne'] = row_values[15]
// shifts['crewOneReplaced'] = row_values[16]
// shifts['crewTwo'] = row_values[20]
// shifts['crewTwoReplaced'] = row_values[21]