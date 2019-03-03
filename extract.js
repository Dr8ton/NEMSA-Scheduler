var xlsx = require('node-xlsx').default;

const workSheetsFromFile = xlsx.parse(`Daily.xlsx`);
console.log(workSheetsFromFile[0].data);

// TODO: work the spreadsheet