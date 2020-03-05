# NEMSA-Scheduler

down load the Raw scheduel xlxs from Crew scheduler: 
https://developers.google.com/web/tools/puppeteer/get-started

extract data from report: 
https://github.com/exceljs/exceljs

Store data in Firestore. 

authentication : https://medium.com/@smccartney09/integrating-firebase-cloud-functions-with-google-calendar-api-9a5ac042e869

Document functions: http://usejsdoc.org/index.html#block-tags

//'SchedShiftID',0, unique ID of shift
//  'ShiftName',1, truck full name
//  'LocationCode',2 station

//  'ShiftDate',3 date but not time of start or finish
//  'StartTime',4 DTG that shift starts
//  'EndTime',5 DTG that the shift ends
//  'Notes',6 STUDENT/RIDER: ${student}

//  PlannedRes1, 10 truck number 

//  'PlannedRes2',15, crewOne
//  'ActualRes2',16 replacedOne

//  'PlannedRes3',20, crewTwo
//  'ActualRes3',21, replacedTwo

enum Shift {
    Id = 0,
    ShiftName = 1,
    StationCode = 2,
    ShiftDate = 3,
    StartTime = 4,
    EndTime = 5,
    Notes = 6,
    TruckNumber = 10,
    CrewOne = 15,
    ReplacedOne = 16,
    CrewTwo = 20,
    ReplacedTwo = 21
}