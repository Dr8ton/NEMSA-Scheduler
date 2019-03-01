var Excel = require('exceljs');

// read from a file
//var workbook = new Excel.Workbook();

workbook.xlsx.readFile("./raw.xlsx")
     .then(function(data) {
         console.log(workbook)
        var worksheet = workbook.getWorksheet("Worksheet1");
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
        });
    })
    .catch(function(err){
        console.log(err)
    });