var xlsx = require('node-xlsx').default;

const workSheetsFromFile = xlsx.parse(`Daily.xlsx`);
console.log(workSheetsFromFile[0].data[4][9]);

// TODO: work the spreadsheet

//  [ 4980781,
//    '301: Day O (12hr std crew)',
//    'CAD',
//    43520,
//    43520.25,
//    43520.75,
//    <3 empty items>,
//    true,
//    '301',
//    <4 empty items>,
//    '018124 Primeaux, M.',
//    <4 empty items>,
//    '018263 Valencia, C.',
//    <14 empty items>,
//    3,
//    0,
//    0,
//    0 ],

function isActiveParamedicPreceptor(){
    
}

function isActiveEMTPreceptor(){
    
}

function isSprintTruck(){
    
}