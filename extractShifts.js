
import Excel from 'exceljs';

const book = [];
workbook.getWorksheet(
    ( sheet => {
  const sheet = [];
  worksheet.eachRow(row => {
    sheet.push(row.values);
  });
book.push(sheet);
});

https://github.com/exceljs/exceljs#access-worksheets

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