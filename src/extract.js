var xlsx = require('node-xlsx').default;

const workSheetsFromFile = xlsx.parse(`Daily.xlsx`);
console.log(workSheetsFromFile[0].data[2][16]);

// TODO: work the spreadsheet


//'SchedShiftID',0
//  'ShiftName',1
//  'LocationCode',2
//  'ShiftDate',3
//  'StartTime',4
//  'EndTime',5
//  'Notes',6
//  'FreeTextSlot',7
//  'Status',8
//  'HasVehicle',9
//  'PlannedRes1',10
//  'ActualRes1',11
//  'PayrollCode1',12
//  'ApprovedBy1',13
//  'SplitText1',14
//  'PlannedRes2',15
//  'ActualRes2',16
//  'PayrollCode2',17
//  'ApprovedBy2',18
//  'SplitText2',19
//  'PlannedRes3',20
//  'ActualRes3',21
//  'PayrollCode3',22
//  'ApprovedBy3',23
//  'SplitText3',24
//  'PlannedRes4',25
//  'ActualRes4',26
//  'PayrollCode4',27
//  'ApprovedBy4',28
//  'SplitText4',29
//  'PlannedRes5',30
//  'ActualRes5',31
//  'PayrollCode5',32
//  'ApprovedBy5',33
//  'SplitText5',34
//  'SlotCount',35
//  'c1optional',36
//  'c2optional',37
//  'c3optional',38
//  'c4optional',39
//  'c5optional' ]38



function isActiveParamedicPreceptor(){
    
}

function isActiveEMTPreceptor(){
    
}

function isSprintTruck(){
    
}